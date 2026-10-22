const a=require('../lib/atlas.cjs');
module.exports=async(req,res)=>{try{if(req.method!=='GET')return a.json(res,405,{error:'Method not allowed'});if(!a.configured())return a.json(res,200,{lessons:[],images:{}});const {catalog}=await a.readCatalog();a.json(res,200,a.publicCatalog(catalog))}catch(e){a.failure(res,e)}};
