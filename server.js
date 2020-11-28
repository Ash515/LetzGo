const express=require('express');
const app=express();
const PORT=3000 ||process.env.PORT;
app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
