import express from 'express'
import User from '../models/users.js';


const router = express.Router();

router.get('/login', (req, res) => {
    const errMessage = req.query.errMessage;
    res.render('login',{errMessage});
});
router.get('/signup', (req, res) => {
    const errMessage = req.query.errMessage;
    res.render('signup',{errMessage});
});

router.post('/signup', async (req, res) => {
    try{
        const {username , password} = req.body;

        if (!username || !password) {
            return res.redirect('/auth/signup?errMessage=Enter+password+or+username');
        }
      
        const olduser = await User.findOne({username});
        if(olduser)
            res.redirect('/auth/signup?errMessage=Username+already+exists.');
        else{

            const user = new User({username , password});
            await user.save();
            
            req.session.user = user;
            res.redirect(`/dashboard`);
        }
    }
    catch(err){
        console.log(err)
        res.redirect('/');
    }
      
});

router.post('/login' , async(req , res) =>{
    const {username , password} = req.body;
    const user = await User.findOne({username});
    if(!user)
        res.redirect('/auth/login?errMessage=Username+not+found');

    else{

        user.comparePassword(password , (err,isMatch)=>{
            if(isMatch){
                req.session.user = user;
                return res.redirect(`/dashboard`)
            }
            else{
                return res.redirect('/auth/login?errMessage=Wrong+password');
            }
        })
    }
})

router.get('/logout',(req,res)=>{
    req.session.destroy(err=>{
        if(err)
            return res.redirect('/');
        
        res.clearCookie('connect.sid');
        res.redirect('/');
    })
})

export default router;