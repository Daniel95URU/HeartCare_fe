const express = require('express');
const { createLogin, recoverPassword, createSignup } = require('../controllers/fun.controllers');
const BoProject = require('../BO/boproject');
const boProject = new BoProject();
const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
  res.send('Debe loguearse');
});

router.post('/login', createLogin);
router.post('/recover-password', recoverPassword);
router.post('/signup', createSignup);
router.post('/createproject', boProject.createProject.bind(boProject));
router.get('/allproject/:id_per', boProject.getProjects.bind(boProject));
router.delete('/deleteproject/:id_proyecto',boProject.deleteProject.bind(boProject));
router.post('/addmember', boProject.addMemberProject.bind(boProject));
router.get('/getmember/:id_proyecto', boProject.projectMember.bind(boProject));
router.put('/updatemember', boProject.editProfileMember.bind(boProject));
router.delete('/removemember/:id_proyecto',boProject.deleteMember.bind(boProject));
router.get('/getactivity/:id_proyecto', boProject.memberActivity.bind(boProject));
router.post('/addtask', boProject.addTask.bind(boProject));
router.get('/calendar/:id_per', boProject.calendarActivity.bind(boProject));

module.exports = router;
