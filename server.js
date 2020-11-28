const path=require('path')
const express=require('express');
const app=express();
//Set Static folder
app.use(express.static(path.join(__dirname,'Public')));
const PORT=3000 ||process.env.PORT;
app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
