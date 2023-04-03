const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();
const _ = require('lodash');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

main().catch(err=>console.log(err));

async function main(){ 
    await mongoose.connect("mongodb+srv://manmeet99:Manmeet%4099@cluster0.n944r8p.mongodb.net/todoListDB");

const itemsSchema = new mongoose.Schema({
    name:String
});
const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name:"Eating Breakfast"
});
const item2 = new Item({
    name:"Press + to add a new item."
});
const item3 = new Item({
    name:"How was your day?"
});
const defaultItems = [item1,item2,item3];

app.get("/", (req, res) => {
    Item.find({})
        .then(items=>{
            if(items.length === 0){
                Item.insertMany(defaultItems);
                res.redirect("/");
            }else{
                res.render("list", { listTitle: "Today",newListItem: items });
            }
            
        })
});

app.post("/",(req,res)=>{
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name:itemName
    });

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName})
            .then((foundList)=>{
                foundList.items.push(item);
                foundList.save();
                res.redirect("/"+listName);
            })
    }


});

app.post("/delete",(req,res)=>{
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove({_id:checkedItemId})
        .then(()=>{
            res.redirect("/");
        });
    }else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}})
            .then(()=>{
                res.redirect("/"+ listName);
            })
    }
});

    //LIST SCHEMA
    const listSchema = {
        name:String,
        items:[itemsSchema]
    };
    //LIST MODEL
    const List = mongoose.model("List",listSchema);

app.get("/:customListName",(req,res)=>{
    const customListName = _.capitalize(req.params.customListName);
    
    List.findOne({name:customListName})
        .then((foundList)=>{
            if(!foundList){
                const list = new List({
                    name:customListName,
                    items:defaultItems
                });
                list.save();
                res.redirect("/"+customListName);
            }else{
                res.render("list",{ listTitle: foundList.name,newListItem: foundList.items });
            }
        })

    
    
});

app.listen(3000, (req, res) => {
  console.log("Server is running at port 3000");
});
}