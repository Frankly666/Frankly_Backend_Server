function mapPermission(res) {
  const permission = {};

  for(let item of res){
    let father = item.father;
    let url = item.url;
    let name = item.name;

    let fatherList = permission[father];
    if(!fatherList) {
      fatherList = [];
      permission[father] = fatherList;
    }

    fatherList.push({name, url});
  }


  return permission;
}

module.exports = {
  mapPermission
}