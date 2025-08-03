const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: [true, "category must be unique"],
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
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const setImageUrl=(doc)=>{
       if(doc.image){
        const imageUrl=`${process.env.BASE_URL}/category/${doc.image}`;
        doc.image=imageUrl;
    }
}
categorySchema.post("init", (doc) =>{
   setImageUrl(doc)
});
categorySchema.post("save", (doc) =>{
    setImageUrl(doc)
});

module.exports = mongoose.model("Category", categorySchema);
