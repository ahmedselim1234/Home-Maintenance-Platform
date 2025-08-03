const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      
    },
   slug: {
    type: String,
      lowercase: true,
      trim: true,

    },
    description: {
      type: String, 
      required: [true, "description is required"],
      minlength: [5, "description must be at least 10 characters"],
    },
    technicain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    duration:Number,
    price: {
      type: Number,
      required: [true, "price is required"],
      min: [0, "price must be greater than or equal to 0"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "category is required"],
    },
    image: {
      type: String,
     
    },
  },
  { timestamps: true }
);

const setImageUrl=(doc)=>{
       if(doc.image){
        const imageUrl=`${process.env.BASE_URL}/Service/${doc.image}`;
        doc.image=imageUrl;
    }
}
serviceSchema.post("init", (doc) =>{
   setImageUrl(doc)
});
serviceSchema.post("save", (doc) =>{
    setImageUrl(doc)
});

module.exports = mongoose.model("Service", serviceSchema);
