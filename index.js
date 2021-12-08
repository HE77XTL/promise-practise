class Promise2 {
    static pending = 'pending';
    static fulfilled = 'fulfilled';
    static _rejected = 'rejected';
    static resolve(value) {
        // 判断是否是thenable对象
        if (value instanceof Promise2 || ((typeof value === 'object') && 'then' in value)) {
            return value;
        }

        return new Promise2((resolve) => resolve(value));
    }

    static rejected(value) {
        // 判断是否是thenable对象
        if (value instanceof Promise2 || ((typeof value === 'object') && 'then' in value)) {
            return value;
        }

        return new Promise2( (resolve,reject) => reject(value));
    }
    static all(iterable) {
        return new Promise2((resolve, reject) => {
            const ret = [];
            let count = 0;

            Array.from(iterable).forEach((item, index) => {
                Promise2.resolve(item).then(data => {
                    ret[index] = data;
                    count++;

                    if (count === iterable.length) {
                        resolve(ret);
                    }
                }, reject);
            });
        });
    }

    static race(iterable) {
        return new Promise2((resolve, reject) => {
            Array.from(iterable).forEach(item => {
                Promise2.resolve(item).then(resolve, reject);
            });
        });
    }

    constructor(executor) {
        this.status = Promise2.pending; // 初始化状态为pending
        this.value = undefined; // 存储 this._resolve 即操作成功 返回的值
        this.reason = undefined; // 存储 this._reject 即操作失败 返回的值
        this.callbacks = [];
        executor(this._resolve.bind(this), this._reject.bind(this));
    }

    // onFulfilled 是成功时执行的函数
    // onRejected 是失败时执行的函数
    then(onFulfilled, onRejected) {
        return new Promise2((nextResolve, nextReject) => {
            // 这里之所以把下一个Promsie的resolve函数和reject函数也存在callback中
            // 是为了将onFulfilled的执行结果通过nextResolve传入到下一个Promise作为它的value值
            this._handler({
                nextResolve,
                nextReject,
                onFulfilled,
                onRejected
            });
        });
    }
    catch(onRejected) {
        return this.then(null, onRejected);
    }

    finally(onFinally) {
        return this.then(onFinally, onFinally);
    }
    _resolve(result) {
        if (result instanceof Promise2) {
            result.then(
                this._resolve.bind(this),
                this._reject.bind(this)
            );
            return;
        }
        this.value = result;
        this.status = Promise2.fulfilled; // 将状态设置为成功
        this.callbacks.forEach((cb) => this._handler(cb));
    }

    _reject(reason) {
        if (reason instanceof Promise2) {
            reason.then(
                this._resolve.bind(this),
                this._reject.bind(this)
            );
            return;
        }
        this.reason = reason;
        this.status = Promise2._rejected; // 将状态设置为失败
        this.callbacks.forEach((cb) => this._handler(cb));
    }
    _handler(callback) {
        const { onFulfilled, onRejected, nextResolve, nextReject } = callback;
        if (this.status === Promise2.pending) {
            this.callbacks.push(callback);
            return;
        }


        if (this.status === Promise2.fulfilled) {
            // 传入存储的值
            // 未传入onFulfilled时，将undefined传入
            const nextValue = onFulfilled ? onFulfilled(this.value) : this.value;
            nextResolve(nextValue);
        }

        if (this.status === Promise2._rejected ) {
            // 传入存储的错误信息
            // 同样的处理
            const nextReason = onRejected ? onRejected(this.reason) : this.reason;
            nextReject(nextReason);
        }
    }
}






Promise2.rejected(33).then(res => {
    console.log(res)
})




