class FacebookURI {
  constructor(access_token, route, version) {
    this.access_token = access_token;
    this.route = route;
    this.version = version ? version : '2.8';
    
    this.params = [];
  }
  
  addParam(name, value) {
    this.params.push([name, value]);
  }
  
  getURI() {
    let uri = 'https://graph.facebook.com/v' + this.version + '/' + this.route;
    let first = true;
    let params = this.params.slice();
    params.push(['access_token', this.access_token]);
    
    for (let [name, value] of params) {
      if (first) {
        uri += '?';
        first = false;
      } else {
        uri += '&';
      }
      
      uri += name + '=' + value;
    }
    
    return uri;
  }
}

export {
  FacebookURI,
};
