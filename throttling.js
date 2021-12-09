// 节流, 以较低的频率执行高频操作，
// 节流， 水流变小， 高频操作改为低频操作
// 比如 窗口 resize 触发事件，将触发频率降到 300ms 执行一次

function throttle(fn, delay) {
    let canUse = true;
    return function () {
        if(canUse) {
            fn.apply(this, arguments);
            canUse = false;
            setTimeout(()=>{
                canUse = true
            },delay);
        }
    }

}

const throttleA = throttle(() => {
    console.log('hi')
}, 300);

throttleA()
throttleA()
throttleA()
throttleA()

setTimeout(()=> {
    throttleA()
}, 300)

