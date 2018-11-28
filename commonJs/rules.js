class rules{
    constructor(){
        this.rule = /^[a-zA-Z1-9]+$/; //账号范围英文数字
        this.rule2 = /^[1-9]+$/ ; //判断纯数字
    }
    check_user_id(user_id){
      if (user_id > 16 || user_id < 6) {
         return false
      }
      return true
    }
    check_pwd(pwd){
        if (pwd < 6) {
          return false
        }
        return true
    }
    test(arg){
      if (!this.rule.test(arg)) {
        return false
      }
      return true
    }
    test2(arg){
      if (this.rule2.test(arg)) {
        return false
      }
      return true
    }
    json(errCode,data){
       return {
         errCode,
         data
       }
    }
}
module.exports = new rules();
