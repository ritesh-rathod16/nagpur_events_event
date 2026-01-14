(async()=>{
  try{
    const r=await fetch('http://127.0.0.1:3002/');
    console.log('status', r.status);
    console.log('text', await r.text());
  }catch(e){
    console.error('fetch err', e);
  }
})();
