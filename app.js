const express = require('express');
const app = express();
const mongoose = require("mongoose");
const cors=require("cors");

const PORT = 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}));

const MONGO_URI='mongodb+srv://govardhant23csr066:passwordforMONGO@cluster0.sbljj.mongodb.net/expenses?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(()=> console.log("Successfully Connected !!"))
  .catch((err)=> {
    console.error("Mongo connection error:",err);
    process.exit(1);
  });

const expenseSchema=new mongoose.Schema({
  title:{type:String , required : true},
  amount:{type:Number , required:true}
})

const Expense=mongoose.model('Expense',expenseSchema);

app.post('/expense', async (req, res) => {
  try {
    const { title, amount } = req.body;
    const expense = new Expense({ title, amount });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error('Error saving expense:', error);
    res.status(500).json({ error: 'Failed to save expense' });
  }
});

app.get('/expense', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

app.put('/expense/:id',async(req,res)=>{
  try{
      const updateExpense=await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
      );
      if(!updateExpense){
        return res.status(404).json({error:"Expense not found"});
      }
      res.json(updateExpense);
  }catch(error){
    console.error('Error updating expenses:',error);
    res.status(500).json({ error: 'Failed to update expenses' });
  }
})
app.delete('/expense/:id',async(req,res)=>{
  try{
      const updateExpense=await Expense.findByIdAndDelete(
      req.params.id,
      req.body,
      );
      if(!updateExpense){
        return res.status(404).json({error:"Expense not found"});
      }
      res.json(updateExpense);
  }catch(error){
    console.error('Error deleting expenses:',error);
    res.status(500).json({ error: 'Failed to delete expenses' });
  }
})


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
