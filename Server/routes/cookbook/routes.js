var mongoose = require("mongoose");

const Categories = require('../../models/cookbook/categories');
const Recipe = require('../../models/cookbook/recipe');
const User = require('../../models/user');


const verifyToken = require('../session/verifyToken');


module.exports = function(app){
    /** GET Methods*/
    /**
     * @openapi
     *  '/cookbook/recipes':
     *      get:
     *          tags: 
     *              - Get Methods Cookbook
     *          summary: Get all recipes
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
    app.get('/cookbook/recipes', async function (req,res){
        try{
            let recipes = await Recipe.find();
            res.status(200).send(recipes);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
    });

    /**
     * @openapi
     *  '/cookbook/recipe/:recipeId':
     *      get:
     *          tags:
     *              - Get Methods Cookbook
     *          summary: Get a specific recipes
     *          parameters:
     *              - name: recipeId
     *                in: path
     *                description: The ID of the recipe
     *                required: true
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
     app.get('/cookbook/recipe/:recipeId', async function (req,res){
        try{
            let recipe = await Recipe.findById(req.params.recipeId).populate('comments.user', 'firstname lastname');
            res.status(200).send(recipe);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

    /**
     * @openapi
     *  '/cookbook/user/recipe':
     *      get:
     *          tags:
     *              - Get Methods Cookbook
     *          summary: Get recipes from the current user
     *          security:
     *              - bearerAuth: []
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
     app.get('/cookbook/user/recipe/',verifyToken, async function (req,res){
        try{
            let recipes = await Recipe.find({user:req.user.id});
            res.status(200).send(recipes);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

     /**
     * @openapi
     *  '/cookbook/categories':
     *      get:
     *          tags:
     *              - Get Methods Cookbook
     *          summary: Get all categories
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
     app.get('/cookbook/categories/', async function (req,res){
        try{     
            let categories = await Categories.find();
            res.status(200).send(categories);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

     /**
     * @openapi
     *  '/cookbook/search':
     *      get:
     *          tags:
     *              - Get Methods Cookbook
     *          summary: search for a recipe
     *          security:
     *              - bearerAuth: []
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
     app.get('/cookbook/search',verifyToken, async function (req,res){
        try{     
            const filters = req.query.tags;
            const category = req.query.category;

            let recipes = null;
            let searchTags = null; 
            let searchCategories = null;
            if(filters){
                searchTags = filters.toLowerCase().split(',')
            }

            if(category){
                //if (typeof category === "string" && category.trim() !== "") {
                    //const categoryNames = category.toLowerCase().split(",");
                    //const matchingCategories = await Categories.find({
                    //    name: {$in: categoryNames.map(name => new RegExp(`^${name}$`, "i")) }
                    //});
                    //searchCategories = matchingCategories.map(c=>c._id);
                    searchCategories = category.toLowerCase().split(',');
                //}
            }


            if(filters && !category){
                recipes = await Recipe.find({tags:{$in:searchTags}})
            }else if(!filters  && category){
                recipes = await Recipe.find({categories:{$in:searchCategories}});
            }else if (filters && category){
                recipes = await Recipe.find({categories:{$in:searchCategories}, tags:{$in:searchTags}});
            }
            res.status(200).send(recipes);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });


     /**
     * @openapi
     *  '/cookbook/saved/':
     *      get:
     *          tags:
     *              - Get Methods Cookbook
     *          summary: Get all recipes the user saved/liked
     *          security:
     *              - bearerAuth: []
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
     app.get('/cookbook/saved/', verifyToken, async function (req,res){
        try{     
            let recipes = await User.findOne({_id:req.user.id}).populate('savedRecipes');
            res.status(200).send(recipes);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });



     /**
     * @openapi
     * '/cookbook/recipe/':
     *  post:
     *     tags: 
     *     - Post Methods Cookbook
     *     summary: Add a recipe
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - name
     *              - ingredients
     *              - portion
     *              - nutritionalValues
     *              - directions
     *              - tags
     *              - href
     *              - time
     *              - comments
     *              - rating
     *              - categories
     *              - user
     *            properties:
     *              name:
     *                  type: String
     *                  default: "abc"
     *              ingredients: 
     *                  type: [Object]
     *                  default: [{ingredient,amount,unit}]
     *              portion:
     *                  type: Number
     *                  default: 123
     *              nutritionalValues: 
     *                  type: [Object]
     *                  default: [{kcal,protein,fat,carbohydrates}]
     *              directions:
     *                  type: String
     *                  default: "abc"
     *              tags:
     *                  type: [String]
     *                  default: ["abc"]
     *              href:
     *                  type: String
     *                  default: "abc"
     *              time:
     *                  type: Number
     *                  default: 123
     *              comments: 
     *                  type: [Object]
     *                  default: [{user,comment}]
     *              rating:
     *                  type: [Number]
     *                  default: [ 1, 2, 4]
     *              categories:
     *                  type: [ObjectId]
     *                  default: [ObjectId("54fghgf645"), ObjectId("hga76ghasd")]
     *              user:
     *                  type: ObjectId
     *                  default: ObjectId("hgasdhasgtutzutt45tdgd")
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.post('/cookbook/recipe/', verifyToken,function (req,res){
        try{

            let recipeData = req.body
            recipeData.user = req.user.id;
            recipeData.tags = (recipeData.tags || []).map(v => v.toLowerCase());
            recipeData.portion = parseInt(recipeData.portion);
            recipeData.time = parseInt(recipeData.time);
            recipeData.ingredients = recipeData.ingredients.map(ingredient => ({
                ...ingredient,
                amount: parseFloat(ingredient.amount)
            }));
            let recipe = new Recipe(recipeData);
            recipe.save(function (err){
                if(err){
                    console.error("Mongoose Save Error:", err);
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("successfully added!");
                }
            });
        }catch(error){
            console.error("Serverfehler:", error);
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

/**
     * @openapi
     * '/cookbook/category/':
     *  post:
     *     tags: 
     *     - Post Methods Cookbook
     *     summary: Add a category
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - name
     *              
     *            properties:
     *              name:
     *                type: String
     *                default: "abc"
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.post('/cookbook/category/', function (req,res){
        try{

            let categoryName = req.body
            let category = new Categories(categoryName);
            category.save(function (err){
                if(err){
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("successfully added!");
                }
            });
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });


/**
     * @openapi
     * '/cookbook/save/recipe':
     *  put:
     *     tags: 
     *     - Put Methods Cookbook
     *     summary: Save/Like a recipe
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - recipe
     *            properties:
     *              repice:
     *                type: ObjectId
     *                default: ObjectId("adasdadhjkh89234")
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.put('/cookbook/save/recipe', verifyToken,async function (req,res){
        try{
            let recipeId = req.body.recipe
            let user = await User.findOne({_id:req.user.id});
            user.savedRecipes.push(recipeId);
            user.save(function (err){
                if(err){
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("successfully updated!");
                }
            });
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });
     
     /**
     * @openapi
     * '/cookbook/save/delete/recipe':
     *  put:
     *     tags: 
     *     - Put Methods Cookbook
     *     summary: Unlike a recipe and delete the like
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - recipe
     *            properties:
     *              repice:
     *                type: ObjectId
     *                default: ObjectId("adasdadhjkh89234")
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.put('/cookbook/save/delete/recipe', verifyToken,async function (req,res){
        try{
            let recipeId = req.body.recipe
            await User.updateOne({_id:req.user.id},{$pull:{savedRecipes:recipeId}});
            res.status(201).send("successfully updated!");
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

     /**
     * @openapi
     * '/cookbook/rate/recipe':
     *  put:
     *     tags: 
     *     - Put Methods Cookbook
     *     summary: Save/Like a recipe
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - recipe
     *              - rating
     *            properties:
     *              repice:
     *                type: ObjectId
     *                default: ObjectId("adasdadhjkh89234")
     *              rateing:
     *                  type: Number
     *                  defult: 1
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.put('/cookbook/rate/recipe', verifyToken,async function (req,res){
        try{
            let rating = req.body.rating;
            let recipeId = req.body.recipe
            let recipe = await Recipe.findById(recipeId);
            recipe.rating.push(rating);
            recipe.save(function (err){
                if(err){
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("successfully updated!");
                }
            });
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

     /**
     * @openapi
     * '/cookbook/comment/recipe':
     *  put:
     *     tags: 
     *     - Put Methods Cookbook
     *     summary: Save/Like a recipe
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - recipe
     *              - comment
     *            properties:
     *              repice:
     *                type: ObjectId
     *                default: ObjectId("adasdadhjkh89234")
     *              comment:
     *                  type: String
     *                  default: "abc"
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.put('/cookbook/comment/recipe', verifyToken,async function (req,res){
        try{
            let comment = req.body.comment;
            let recipeId = req.body.recipe
            let recipe = await Recipe.findById(recipeId);

            const c = {user:req.user.id,comment}

            recipe.comments.push(c);
            recipe.save(function (err){
                if(err){
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("successfully updated!");
                }
            });
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

     /**
     * @openapi
     * '/cookbook/commentrate/recipe':
     *  put:
     *     tags: 
     *     - Put Methods Cookbook
     *     summary: Save/Like a recipe
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - recipe
     *              - rating
     *              - recipe
     *            properties:
     *              repice:
     *                type: ObjectId
     *                default: ObjectId("adasdadhjkh89234")
     *              comment:
     *                type: String
     *                default: "abc"
     *              rating:
     *                type: Number
     *                default: 1  
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.put('/cookbook/commentrate/recipe', verifyToken,async function (req,res){
        try{
            let comment = req.body.comment;
            let rating = req.body.rating;
            let recipeId = req.body.recipe
            let recipe = await Recipe.findById(recipeId);

            const c = {user:req.user.id,comment}

            recipe.rating.push(rating);
            recipe.comments.push(c);
            recipe.save(function (err){
                if(err){
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("successfully updated!");
                }
            });
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });
/**
     * @openapi
     * '/cookbook/delete/:recipe':
     *  delete:
     *     tags: 
     *          - Delete Methods Cookbook
     *     summary: delete a recipe
     *     security:
     *          - bearerAuth: []
     *     parameters:
     *          - name: recipe
     *            in: path
     *            description: The ID of the recipe
     *            required: true
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.delete('/cookbook/delete/:recipe', verifyToken,async function (req,res){
        try{
            let recipeId = req.params.recipe
            let userId = req.user.id
            const returnValue = await Recipe.deleteOne({_id:recipeId,user:userId})
            if(returnValue.deletedCount == 1){
                res.status(201).send("successfully deleted!");
            }else{
                res.status(422).send("something did go wrong while deleting");
            }
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });



} 