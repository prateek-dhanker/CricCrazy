import express from 'express'
import Player from '../models/players.js';

const router = express.Router();

router.get('/' , (req,res)=>{
    const user = req.session.user;
    if (!user) {
      return res.redirect('/auth/login');
    }
    res.render('dashboard', { user });
})
router.get('/players' , async (req,res)=>{
    const user = req.session.user;
    if (!user) {
      return res.redirect('/auth/login');
    }
    const allPlayers = await Player.find({user:user._id});
    const total = await Player.find({user:user._id}).countDocuments();
    const batsman = await Player.find({user:user._id,category:"batsman"}).countDocuments();
    const bowler = await Player.find({user:user._id,category:"bowler"}).countDocuments();
    const allrounder = await Player.find({user:user._id,category:"allrounder"}).countDocuments();
    res.render('players',{user , allPlayers , total , batsman , bowler , allrounder});
})

router.get('/players/sort/:filter', async (req, res) => {
  try {
      const user = req.session.user;
      const filter = req.params.filter;

      if (!user) {
          return res.redirect('/auth/login');
      }

      const sortObj = {};
      sortObj[filter] = -1; // Sort by the filter in descending order

      // Find all players for the user and sort them based on the filter
      const allPlayers = await Player.find({ user: user._id }).sort(sortObj);

      const total = await Player.find({ user: user._id }).countDocuments();
      const batsman = await Player.find({ user: user._id, category: "batsman" }).countDocuments();
      const bowler = await Player.find({ user: user._id, category: "bowler" }).countDocuments();
      const allrounder = await Player.find({ user: user._id, category: "allrounder" }).countDocuments();

      res.render('players', { user, allPlayers, total, batsman, bowler, allrounder });
  } catch (error) {
      console.error('Error in sorting players by runs:', error);
      res.sendStatus(500); // Internal Server Error
  }
});

router.get('/addplayer' , (req,res)=>{
    const errMessage = req.query.errMessage;
    const user = req.session.user;
    if (!user) {
      return res.redirect('/auth/login');
    }
    res.render('addplayer',{user , errMessage});
})

router.post('/addplayer', async (req, res) => {
  try {
      const { 
          name, 
          category, 
          matches, 
          'innings-bat': innings, 
          'runs-bat': runs, 
          'balls-bat': ballsBat, 
          notout, 
          fifties, 
          hundreds, 
          highest, 
          'balls-ball': ballsBall, 
          wickets, 
          'runs-ball': runsBall, 
          fivers 
      } = req.body;
      
      const user = await req.session.user;
      
      if (!user) {
          return res.status(401).json({ message: 'User not authenticated' });
      }
      
      const userId = user._id;

      const playerData = {
          name,
          category,
          matches: Number(matches),
          batting: {
              innings: Number(innings),
              runs: Number(runs),
              balls: Number(ballsBat),
              notout: Number(notout),
              fifties: Number(fifties),
              hundreds: Number(hundreds),
              highest: Number(highest)
          },
          bowling: {
              balls: Number(ballsBall),
              wickets: Number(wickets),
              runs: Number(runsBall),
              fivers: Number(fivers)
          },
          user: userId
      };
      const existingPlayer = await Player.findOne({ name: name , user:userId});
      if (existingPlayer) {
          res.redirect('/dashboard/addplayer?errMessage=Player+allready+exists.');
      }

      else{
        const newPlayer = new Player(playerData);
        await newPlayer.save();
        res.redirect('/dashboard/players');
      }
  } catch (error) {
      console.error('Error creating player:', error);
      res.status(400).json({ message: error.message });
  }
});
    
router.get('/showstats/:playername', async (req, res) => {
  try {
      const playername = req.params.playername;
      if (!req.session.user) {
        return res.redirect('/auth/login');
      }
      const userId = req.session.user._id;
      const player = await Player.findOne({user:userId, name: playername });
      if (!player) {
          return res.status(404).send('Player not found');
      }
      res.render('showstats', { player });
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
});

router.get('/delete/:playername' , async(req, res)=>{
  try {
    const playername = req.params.playername;
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }
    const userId = req.session.user._id;
    await Player.deleteOne({user:userId, name: playername });
    
    res.redirect('/dashboard/players')
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
})
router.get('/edit/:playername', async (req,res)=>{
  try {
      const errMessage = req.query.errMessage;
      const playername = req.params.playername;
      if (!req.session.user) {
        return res.redirect('/auth/login');
      }
      const userId = req.session.user._id;
      const player = await Player.findOne({user:userId, name: playername });
      if (!player) {
          return res.status(404).send('Player not found');
      }
      res.render('edit', { player , errMessage });
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
})
router.post('/edit/:playername', async (req, res) => {
  try {
    const playername = req.params.playername;
    if(!req.session.user)
      return res.status(404).send('User not authorised');

    const userId = req.session.user._id;
    const player = await Player.findOne({ user: userId, name: playername });

    if (!player) {
      return res.status(404).send(`Player not found ${playername}`);
    }

    if(playername != req.body.name){

      const existingPlayer = await Player.findOne({ name: req.body.name , user:userId});
      if (existingPlayer) {
        res.redirect(`/dashboard/edit/${playername}?errMessage=Player+allready+exists.`);
        return;
      }
      player.name = req.body.name;
    }

    player.category = req.body.category;
    player.matches = req.body.matches;
    player.batting.innings = req.body['innings-bat'];
    player.batting.runs = req.body['runs-bat'];
    player.batting.balls = req.body['balls-bat'];
    player.batting.notout = req.body.notout;
    player.batting.fifties = req.body.fifties;
    player.batting.hundreds = req.body.hundreds;
    player.batting.highest = req.body.highest;
    player.bowling.balls = req.body['balls-ball'];
    player.bowling.wickets = req.body.wickets;
    player.bowling.runs = req.body['runs-ball'];
    player.bowling.fivers = req.body.fivers;

    // Save the updated player
    const newName = req.body.name;
    await player.save();
    res.redirect(`/dashboard/showstats/${newName}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});
router.get('/teams',(req, res)=>{
  res.render('teams');
})

export default router;