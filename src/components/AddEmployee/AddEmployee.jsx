import React,{useState,useRef} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles({
    imageUpload: {
        fontSize:"1rem",
        fontWeight:300,
        fontFamily: "'Montserrat', sans-serif",
        marginBottom: "2rem"
    },
    imageUploadButton:{
        marginTop : "0.5rem"
    },
    experiencesChips:{
        maxWidth:"25% !important"
    }
  });

const AddEmployee = () => {

    const dispatch = useDispatch()
    const inputElement = useRef();
    const classes = useStyles();
    const {id} = useParams()
    const creationStatus = useSelector(store => store.errors.employeeCreationMessage)
    const editValues = useSelector(store => store.employee[id])
    const editExperiences = ()=>editValues.experiences.map(emp=>emp.employeeExperience)
    const [editMode, seteditMode] = useState(window.location.pathname.split('/')[1] === 'edit')
    const [name, setname] = useState(editMode ? editValues.name : "" )
    const [designation, setdesignation] = useState(editMode ? editValues.designation : "")
    const [grossSalary, setgrossSalary] = useState(editMode ? editValues.grossSalary : "")
    const [netSalary, setnetSalary] = useState(editMode ? editValues.netSalary : "")
    const [taxes, settaxes] = useState(editMode ? editValues.taxes : "")
    const [role, setrole] = useState(editMode ? editValues.role : "")
    const [status, setstatus] = useState(editMode ? editValues.status : "active")
    const [department, setdepartment] = useState(editMode ? editValues.department : "Technical")
    const [experience, setexperience] = useState("")
    const [experiences, setexperiences] = useState(editMode ? editExperiences() : [])
    const [image, setImage] = useState("")
    

    const handleSnackClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      creationStatus === "Created" && resetForm()
      dispatch({type : 'CLEAR_EMPLOYEE_CREATION_MESSAGE'})
    };
    

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
      });

    const handleExperienceDelete = (id) => {
        const newArray = [...experiences]
        newArray.splice(id,1)
        setexperiences(newArray)
    }

    const onSubmitHandler = () => {
        const data = new FormData()
        data.append('name', name)
        data.append('designation', designation)
        data.append('grossSalary', grossSalary)
        data.append('netSalary', netSalary)
        data.append('taxes', taxes)
        data.append('role', role)
        data.append('status', status)
        data.append('department', department)
        data.append('experiences', JSON.stringify(experiences))
        data.append('image', image)
        dispatch({
            type : 'SUBMIT_EMPLOYEE_DATA',
            payload : data
        })
    }

    const onUpdateHandler = ()=>{
        const data = {id : editValues._id , name , designation, grossSalary, netSalary ,taxes , role, status,
            department,experiences
        }
        dispatch({
            type : 'UPDATE_EMPLOYEE_DATA',
            payload : data
        })
    }

    const resetForm = () => {
        setname("")
        setdesignation("")
        setgrossSalary("")
        setnetSalary("")
        settaxes("")
        setrole("")
        setstatus("active")
        setdepartment("Customer Care")
        setexperience("")
        setexperiences([])
        setImage("")
        inputElement.current.value = null
    }


    return (
        <>
        <Grid container item direction="column" spacing={2} alignContent="center">
            <Grid item >
                <Typography variant="h6"> Add An Employee</Typography>
            </Grid>
            <Grid item>
                <TextField
                required
                label="Name"
                value={name}
                onChange={(e)=>{setname(e.target.value)}}
                />
            </Grid>
            <Grid item>
                <TextField
                required
                label="Designation"
                value={designation}
                onChange={(e)=>{setdesignation(e.target.value)}}
                />
            </Grid>
            {!editMode &&
            <Grid item>
                <FormLabel >Upload Image</FormLabel>
                <br/>
                <input type="file" id = "image-upload" required
                className = {classes.imageUploadButton}
                ref={inputElement}
                onChange={(e)=>{setImage(e.target.files[0])}}
                />
            </Grid>
            }
            <Grid item>
                <TextField
                required
                type = "number"
                label="Gross Salary"
                value={grossSalary}
                onChange={(e)=>{setgrossSalary(e.target.value)}}
                />
            </Grid>
            <Grid item>
                <TextField
                required
                type = "number"
                label="Net Salary"
                value={netSalary}
                onChange={(e)=>{setnetSalary(e.target.value)}}
                />
            </Grid>
            <Grid item>
                <TextField
                required
                type = "number"
                label="Taxes"
                value={taxes}
                onChange={(e)=>{settaxes(e.target.value)}}
                />
            </Grid>
            <Grid item>
                <TextField
                required
                label="Role"
                value={role}
                onChange={(e)=>{setrole(e.target.value)}}
                />
            </Grid>
            <Grid item>
            <FormLabel >Status</FormLabel>
            <RadioGroup
                row
                value={status}
                onChange={(e)=>{setstatus(e.target.value)}}
            >
            <FormControlLabel value="active" control={<Radio />} label="Active" />
            <FormControlLabel value="resigned" control={<Radio />} label="Resigned" />
            <FormControlLabel value="terminated" control={<Radio />} label="Terminated" />
            </RadioGroup>
            </Grid>
            <Grid item>
            <InputLabel id="department-select-label">Department</InputLabel>
            <Select
                labelId="department-select-label"
                value={department}
                label="Department"
                onChange={(e)=>{setdepartment(e.target.value)}}
            >
                <MenuItem value="Customer Care">Customer Care</MenuItem>
                <MenuItem value="Technical">Technical</MenuItem>
                <MenuItem value="Human Resource">Human Resource</MenuItem>
            </Select>
            </Grid>
            <Grid item>
                <TextField
                    required
                    label="Add Experiences"
                    value={experience}
                    onChange={(e)=>{setexperience(e.target.value)}}
                    helperText={experiences.length < 1 ? "Add(+) atleast one experience before Submit" : ""}
                />
                <IconButton color="primary" component="span"
                    onClick = {()=>{setexperiences([...experiences,experience]);setexperience("")}}
                    disabled = {!experience}>
                    <AddIcon />
                </IconButton>
            </Grid>
            <Grid item className = {classes.experiencesChips}>
                {experiences.map((exp,index)=><Chip key = {index} label={exp} onDelete={()=>{handleExperienceDelete(index)}}/>)}
            </Grid>
           {
            editMode ?
            <Grid item>
                <Button variant="contained" onClick = {onUpdateHandler} > Update </Button>
            </Grid> :
            <Grid item>
                <Button variant="contained" onClick = {onSubmitHandler} > Submit </Button>
            </Grid>
            }
            </Grid>
            <Snackbar open={creationStatus === "Created"} autoHideDuration={3000} onClose=      {handleSnackClose}>
                <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
                    Employee Created Successfully
                </Alert>
            </Snackbar>
            <Snackbar open={creationStatus === "Could not be created"} autoHideDuration={3000} onClose={handleSnackClose}>
                <Alert onClose={handleSnackClose} severity="error" sx={{ width: '100%' }}>
                    Employee Could not be Created
                </Alert>
            </Snackbar>
            <Snackbar open={creationStatus === "Updated"} autoHideDuration={3000} onClose={handleSnackClose}>
                <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
                    Employee Updated Successfully
                </Alert>
            </Snackbar>
            <Snackbar open={creationStatus === "Could not be Updated"} autoHideDuration={3000} onClose={handleSnackClose}>
                <Alert onClose={handleSnackClose} severity="error" sx={{ width: '100%' }}>
                    Employee Could not be Updated
                </Alert>
            </Snackbar>
        </>
    )
}

export default AddEmployee