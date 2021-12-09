// 防抖、一段时间内的所有高频操作， 最后一次操作后， 等一会再执行
// 相当于 1s 内触发 1万次操作， 在这一万次结束后， 等 300ms（delay 时间） 后再执行一次
// 常见场景： 用户疯狂输入  input 事件不断触发， 但不执行，等用户输入完后， 等一会， 执行一次


function debounce(fn, delay) {
    let timerId = null;
    return function () {
        console.log('触发了');
        const context = this;
        if(timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(()=> {
            fn.apply(context, arguments);
            timerId = null;
        }, delay)
    }
}

const debounceA = debounce(()=> {
    console.log('用户持续输入');
    console.log('只执行了一次')
}, 300);


const start = new Date();
let intervalId = setInterval(()=> {
    const end = new Date();
    if(end.getSeconds() - start.getSeconds() > 2) {
        clearInterval(intervalId)
    }
    debounceA()
}, 100)


