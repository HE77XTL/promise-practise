class Promise2 {
    static pending = 'pending';
    static fulfilled = 'fulfilled';
    static rejected = 'rejected';
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
        this.status = Promise2.rejected; // 将状态设置为失败
        this.callbacks.forEach((cb) => this._handler(cb));
    }
    _handler(callback) {
        const { onFulfilled, onRejected, nextResolve, nextReject } = callback;
        if (this.status === Promise2.pending) {
            this.callbacks.push(callback);
            return;
        }


        if (this.status === Promise2.fulfilled && onFulfilled) {
            // 传入存储的值
            // 未传入onFulfilled时，将undefined传入
            const nextValue = onFulfilled ? onFulfilled(this.value) : undefined;
            nextResolve(nextValue);
            return;

        }

        if (this.status === Promise2.rejected && onRejected) {
            // 传入存储的错误信息
            // 同样的处理
            const nextReason = onRejected ? onRejected(this.reason) : undefined;
            nextReject(nextReason);
        }
    }

}


const a = new Promise2((resolve, reject)=>{
    console.log('00')
    setTimeout(()=>{resolve('resolve-result-2')}, 2000)
});


a.then(() => {
    console.log('resolve-2')
    return 77
}).then((data)=>{
    console.log('resolve-3')
    return new Promise2(resolve => {
        setTimeout(() => {
            resolve(data + ' wei');
        }, 5000);
    });
}).then(result => {
    console.log('result-4')
    console.log(result)
});






