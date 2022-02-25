// 封装返回数据格式
module.exports = {
    setResult:function(code=200,message='success',data=null){
        return{
            "code":code,
            "message": message,
            "data":data
        }
    } 

}