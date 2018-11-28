class util{
  constructor(arg) {
    this.arg = arg;
  }
  static promisify(arg){

    return (...args) => {

      return new Promise((reslove,reject) => {
            arg(...args,(err,data) => {
              if (err) {
                reject(err)
              }else {
                reslove(data)
              }
            })
      })

    }

  }
   remove(array,val){

    const index = array.indexOf(val);

    if (index != -1) {
      array.splice(index,1)
    }

  }

  search(array,index){
    if (array.indexOf(index) == -1) {
      return true
    }
  }

}

module.exports = util
