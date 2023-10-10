const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your TodoList",
});

const item2 = new Item({
  name: "Press the + button to add items",
});

const item3 = new Item({
  name: "<--- Hit this button to delete an item from the list",
});

const defaultItems = [item1, item2, item3];



app.get("/", async function (req, res) {
  try {
    const foundItems = await Item.find({}); // Use async/await to handle the promise

    if (foundItems.length === 0) {
      await Item.insertMany(defaultItems); // Use async/await here as well
      console.log("Successfully saved in the database");
      res.redirect("/");
    } else {
      res.render("list", { KindOfDay: "Today", newListItems: foundItems });
    }
    app.post("/delete", async function(req, res){
      const checkedItemId = req.body.checkbox;
    
      try {
        await Item.findByIdAndRemove(checkedItemId);
        res.redirect("/");
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

 



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



app.post("/", async function (req, res) {
  const itemName = req.body.newItem;

  const newItem = new Item({
    name: itemName,
  });

  try {
    await newItem.save();
    console.log("New item saved successfully.");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, function () {
  console.log("Server started at port 3000");
});
