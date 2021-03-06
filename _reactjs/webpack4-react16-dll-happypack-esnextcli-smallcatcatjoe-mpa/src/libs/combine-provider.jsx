/**
 * 
 * @param {class} RootComponent 第一个参数必须为组件类
 * 
 * 可传入多个provider
 */
export const combineProvider = function () {
  let args = Array.from(arguments); 
  let RealRootComponent = args.shift(); // 将根组件提取出数组并返回

  // 将根节点层层添加到不同的Provider函数中
  RealRootComponent = args.reduce((preProvider, afterProvider) => {
    return afterProvider(preProvider(RealRootComponent))
  })
  
  return RealRootComponent
}