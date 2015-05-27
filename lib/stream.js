var methods = {
  amd: 'toAmd',
  cjs: 'toCjs',
  umd: 'toUmd',
  concat: 'concat'
};

var esperanto = require('esperanto');
var ReadableStream = require('readable-stream');
var util = require('util');

var EsperantoStream = function EsperantoStream(options){
  this.options = options || {};
  if ( !this.options.entry ) {
    throw new Error( "The esperanto-bundle-stream config must specify an entry module (e.g. `{ entry: 'main' }`)" );
  }
  if(this.options.type === 'umd' && typeof this.options.name !== 'string'){
    throw new Error( "The esperanto-bundle-stream config must supply a 'name' option for UMD modules" );
  }
  ReadableStream.call(this,options);

  
  this.options.sourceMap = this.options.sourceMap ? 'inline': false;
  try{
    this.bundle = esperanto.bundle(this.options);
  }catch(e){
    console.log(e);
  }
  this._isBundled = false;
}
util.inherits(EsperantoStream, ReadableStream);
EsperantoStream.prototype._read= function(){
  var self = this,
      method = methods[this.options.type ] || 'toCjs';
  if(this._isBundled){
    this.push(null);
    return;
  }

  
  this.bundle.then(function(bundle){
    console.log('bundle');
    try{
      var result = bundle[method](self.options);
    }catch(err){
      console.error(err);
      self.emit('error', err);
      self._isBundled = true;
      self.push(null);
    }
    self._isBundled = true;
    self.push(result.code);
  }).catch(function(e){
    console.log(e);
    self.emit('error', e);
    self._isBundled = true;
    self.push(null);
  });
};

module.exports = EsperantoStream;