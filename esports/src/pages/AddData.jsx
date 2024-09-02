import React, { useEffect, useState } from 'react';
import '../css/AddData.css'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function AddData() {
  const [status, setStatus] = useState(0);
  const [number, setNumber] = useState('');
  const [captainTeam, setCaptainTeam] = useState([])
  const [captainSet, setCaptainSet] = useState([])
  const maxAllowedValue = 999999;
  const [playerFormData, setPlayerFormData] = useState({
    name: '',
    dob: '',
    sex: '',
    origin: '',
    desc: '',
    photo: []
  });
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    player1: '',
    player2: '',
    player3: '',
    social: '',
    photo: []
  });
  const [finalForm, setFinalForm] = useState({
    team: '',
    captain: '',
    nick1: '',
    nick2: '',
    nick3: '',
    p1: '',
    p2: '',
    p3: '',
    sponsor: '',
    amount: ''
  });
  const [emptyTeam, setEmptyTeam] = useState([])
  useEffect(() => {
    async function getEmptyTeam() {
      try {
        const response = await axios.get("https://b098-2405-201-d00f-608c-4e4b-9e5b-b74a-27a/unassigned_players");
        setCaptainTeam(response.data); // Update state with response.data
      } catch (error) {
        console.error("Error fetching empty teams:", error);
      }
    }
    getEmptyTeam();
  },[status]); // Empty dependency array to ensure this effect runs only once on component mount
  useEffect(() => { 
    async function getEmptyCap() {
      try {
        const response = await axios.get("https://b098-2405-201-d00f-608c-4e4b-9e5b-b74a-27a/get_blank_team");
        setEmptyTeam(response.data[0]); // Update state with response.data
      } catch (error) {
        console.error("Error fetching empty teams:", error);
      }
    }
    getEmptyCap();
  },[status]); // Empty dependency array to ensure this effect runs only once on component mount
  useEffect(() => {
    // Log emptyTeam after it's updated
    setEmptyTeam(emptyTeam);
  });
  const handlePlayerChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'file' ? e.target.files[0] : value;
    setPlayerFormData({
      ...playerFormData,
      [name]: val
    });
  };
  const handlePlayerFileChange = (e) => {
    const file = e.target.files[0];
    setPlayerFormData({
      ...playerFormData,
      photo: file
    });
  };
  const handleTeamFileChange = (e) => {
    const file = e.target.files[0];
    setTeamFormData({
      ...teamFormData,
      photo: file
    });
  };

  const handleTeamChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'file' ? e.target.files[0] : value;
    setTeamFormData(prevState => ({
      ...prevState,
      [name]: val
    }));
  };
  const handleChange = (e) => {
    const inputNumber = e.target.value;
    if (!isNaN(inputNumber) && inputNumber <= maxAllowedValue) {
      setNumber(inputNumber);
    }
    const { name, value, type } = e.target;
    const val = type === 'file' ? e.target.files[0] : value;
    setFinalForm(prevState => ({
      ...prevState,
      [name]: val
    }));
  };
  const handleFinalChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'file' ? e.target.files[0] : value;
    setFinalForm(prevState => ({
      ...prevState,
      [name]: val
    }));
  };
  const handleFinalTeamChange = async (e) => {
    const { name, value, type } = e.target;
    const val = type === 'file' ? e.target.files[0] : value;
    const response = await axios.post("https://b098-2405-201-d00f-608c-4e4b-9e5b-b74a-27a/given_team_players", {
      id: value
    })
    setCaptainSet(response.data)
    finalForm.p1 = response.data[0].pid;
    finalForm.p2 = response.data[1].pid;
    finalForm.p3 = response.data[2].pid;
    setFinalForm(prevState => ({
      ...prevState,
      [name]: val
    }));
  };
  const handleSkip = () => {
    if (!emptyTeam[0]) {
      setStatus(1);
      return toast.error("No empty teams exist!");
    }
    else {
      setStatus(2)
    }
  }
  const handlePlayerSubmit = async (e) => {
    e.preventDefault();
  
    // Check if all fields are filled
    if (!playerFormData.name || !playerFormData.dob || !playerFormData.sex || !playerFormData.origin || !playerFormData.desc || !playerFormData.photo) {
      toast.warn("Please fill in all fields.");
      return;
    }
  
    const formData = new FormData();
    formData.append('photo', playerFormData.photo);
    formData.append('name', playerFormData.name);
    formData.append('dob', playerFormData.dob);
    formData.append('sex', playerFormData.sex);
    formData.append('origin', playerFormData.origin);
    formData.append('desc', playerFormData.desc);
  
    try {
      const response = await toast.promise(
        axios.post("https://b098-2405-201-d00f-608c-4e4b-9e5b-b74a-27a/add_player_data", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }),
        {
          pending: "Waiting for server response...",
          success: "Player data submitted successfully!",
          error: "Failed to submit player data.",
        }
      );
  
      // Reset form data after successful submission
      setPlayerFormData({
        photo: '',
        name: '',
        dob: '',
        sex: '',
        origin: '',
        desc: '',
      });
      setStatus(1);
      
    } catch (error) {
      toast.error(`Error submitting player data: ${error.message}`);
    }
  };
  
  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    if (!teamFormData.name || !teamFormData.player1 || !teamFormData.player2 || !teamFormData.player3 || !teamFormData.social) {
      toast("Please fill in all fields.");
      return;
    }
    const pattern = /^@[a-zA-Z0-9_.-]+$/;
    if (!pattern.test(teamFormData.social)) {
      toast("Invalid Social id.\nHint: Start your id with @");
      return;
    }
    if(!teamFormData.photo){
      toast("We will use a default photo for your team. Dont blame us...")
    }
    const tormData = new FormData();
    tormData.append('photo', teamFormData.photo);
    tormData.append('name', teamFormData.name);
    tormData.append('p1', teamFormData.player1);
    tormData.append('p2', teamFormData.player2);
    tormData.append('p3', teamFormData.player3);
    tormData.append('social', teamFormData.social);
    try {
      await toast.promise(axios.post("https://b098-2405-201-d00f-608c-4e4b-9e5b-b74a-27a/add_team_data", tormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),{
        pending: "Waiting for server response...",
        success: "Team data submitted successfully!",
        error: "Failed to submit team data.",
      });
      setTeamFormData({
        photo: '',
        name: '',
        player1: '',
        player2: '',
        player3: '',
        social: '',
      })
      setStatus(2);
      // Handle success
    } catch (error) {
      toast.error("Error submitting player data:", error.message);
      // Handle error
    }
    // Handle form submission logic here, e.g., send data to server
    
  };
  const [popupStatus, setPopupStatus] = useState(false);
  const finalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!finalForm.amount || !finalForm.captain || !finalForm.nick1 || !finalForm.nick2 || !finalForm.nick3 || !finalForm.sponsor || !finalForm.team) {
      toast("Fill all in the fields please");
      return
      }
      const name_convention = /^[a-zA-Z0-9_.-]{1,12}$/
      if (!name_convention.test(finalForm.nick1)) {
        toast(`Invalid Nickname for ${teamFormData.player1}`)
        return;
      }
      if (!name_convention.test(finalForm.nick2)) {
        toast(`Invalid Nickname for ${teamFormData.player2}`)
        return;
      }
      if (!name_convention.test(finalForm.nick3)) {
        toast(`Invalid Nickname for ${teamFormData.player3}`)
        return;
      }
      setPopupStatus(true)
      toast.success("Successfully recorded details")
    } catch (error) {
      error.log(error)
    }
    
  };
  // const merchNo = 3;
  const [merchDetails, setMerchDetails] = useState({
    m1: '',
    m2: '',
    m3: '',
    p1: '',
    p2: '',
    p3: '',
    q1: 1,
    q2: 1,
    q3: 1,
    tid: ''
  });

  const handleMerchInputChange = (e) => {
    const { name, value } = e.target;
    setMerchDetails({ ...merchDetails, [name]: value });
  };

  const handleMerchSubmit = async (e) => {
    e.preventDefault();
    merchDetails.tid = finalForm.team;
    await toast.promise(axios.post("https://b098-2405-201-d00f-608c-4e4b-9e5b-b74a-27a/add_captain_and_create_merch", {
      team: finalForm,
      merch: merchDetails
    }),{
      pending: "Waiting for server response...",
      success: "Team registered successfully!",
      error: "Failed to register team.",
    })
    setFinalForm({
      team: '',
      captain: '',
      nick1: '',
      nick2: '',
      nick3: '',
      sponsor: '',
      amount: ''
    })
    setMerchDetails({
      m1: '',
      m2: '',
      m3: '',
      p1: '',
      p2: '',
      p3: '',
      q1: 1,
      q2: 1,
      q3: 1,
      tid: ''
    })
    setStatus(0);
    setPopupStatus(false)
    window.open("/", "_self")
  };
  return (
    <div className='main-div' >
      <div className='conditional-com-1'>
        <div className={`main-form-container ${status === 0 ? 'show' : 'hide'}`}>
          <form onSubmit={handlePlayerSubmit} className='add-data-form'>
            <h2 className='add-data-header'>Upload player Details</h2>
            <span className='add-data-form-container-1'>
              <div className='add-data-form-inputs'>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={playerFormData.name}
                  onChange={handlePlayerChange}
                  required
                  placeholder='Enter Player Name'
                  className='add-data-form-input-insides'
                />
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  className='add-data-form-input-insides'
                  value={playerFormData.dob}
                  onChange={handlePlayerChange}
                  required
                />
                <select
                  type="dropdown"
                  id="sex"
                  name="sex"
                  className='add-data-form-input-insides'
                  value={playerFormData.sex}
                  onChange={handlePlayerChange}
                  required>
                  <option value="" disabled>Sex</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                <select
                  type="dropdown"
                  id="origin"
                  name="origin"
                  className='add-data-form-input-insides'
                  value={playerFormData.origin}
                  onChange={handlePlayerChange}
                  required>
                  <option value="" disabled>Country...</option>
                  <option value="Afganistan">Afghanistan</option>
                  <option value="Albania">Albania</option>
                  <option value="Algeria">Algeria</option>
                  <option value="American Samoa">American Samoa</option>
                  <option value="Andorra">Andorra</option>
                  <option value="Angola">Angola</option>
                  <option value="Anguilla">Anguilla</option>
                  <option value="Antigua &amp; Barbuda">Antigua &amp; Barbuda</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Armenia">Armenia</option>
                  <option value="Aruba">Aruba</option>
                  <option value="Australia">Australia</option>
                  <option value="Austria">Austria</option>
                  <option value="Azerbaijan">Azerbaijan</option>
                  <option value="Bahamas">Bahamas</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Barbados">Barbados</option>
                  <option value="Belarus">Belarus</option>
                  <option value="Belgium">Belgium</option>
                  <option value="Belize">Belize</option>
                  <option value="Benin">Benin</option>
                  <option value="Bermuda">Bermuda</option>
                  <option value="Bhutan">Bhutan</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Bonaire">Bonaire</option>
                  <option value="Bosnia &amp; Herzegovina">Bosnia &amp; Herzegovina</option>
                  <option value="Botswana">Botswana</option>
                  <option value="Brazil">Brazil</option>
                  <option value="British Indian Ocean Ter">British Indian Ocean Ter</option>
                  <option value="Brunei">Brunei</option>
                  <option value="Bulgaria">Bulgaria</option>
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Burundi">Burundi</option>
                  <option value="Cambodia">Cambodia</option>
                  <option value="Cameroon">Cameroon</option>
                  <option value="Canada">Canada</option>
                  <option value="Canary Islands">Canary Islands</option>
                  <option value="Cape Verde">Cape Verde</option>
                  <option value="Cayman Islands">Cayman Islands</option>
                  <option value="Central African Republic">Central African Republic</option>
                  <option value="Chad">Chad</option>
                  <option value="Channel Islands">Channel Islands</option>
                  <option value="Chile">Chile</option>
                  <option value="China">China</option>
                  <option value="Christmas Island">Christmas Island</option>
                  <option value="Cocos Island">Cocos Island</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Comoros">Comoros</option>
                  <option value="Congo">Congo</option>
                  <option value="Cook Islands">Cook Islands</option>
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Cote DIvoire">Cote D'Ivoire</option>
                  <option value="Croatia">Croatia</option>
                  <option value="Cuba">Cuba</option>
                  <option value="Curaco">Curacao</option>
                  <option value="Cyprus">Cyprus</option>
                  <option value="Czech Republic">Czech Republic</option>
                  <option value="Denmark">Denmark</option>
                  <option value="Djibouti">Djibouti</option>
                  <option value="Dominica">Dominica</option>
                  <option value="Dominican Republic">Dominican Republic</option>
                  <option value="East Timor">East Timor</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Egypt">Egypt</option>
                  <option value="El Salvador">El Salvador</option>
                  <option value="Equatorial Guinea">Equatorial Guinea</option>
                  <option value="Eritrea">Eritrea</option>
                  <option value="Estonia">Estonia</option>
                  <option value="Ethiopia">Ethiopia</option>
                  <option value="Falkland Islands">Falkland Islands</option>
                  <option value="Faroe Islands">Faroe Islands</option>
                  <option value="Fiji">Fiji</option>
                  <option value="Finland">Finland</option>
                  <option value="France">France</option>
                  <option value="French Guiana">French Guiana</option>
                  <option value="French Polynesia">French Polynesia</option>
                  <option value="French Southern Ter">French Southern Ter</option>
                  <option value="Gabon">Gabon</option>
                  <option value="Gambia">Gambia</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Germany">Germany</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Gibraltar">Gibraltar</option>
                  <option value="Great Britain">Great Britain</option>
                  <option value="Greece">Greece</option>
                  <option value="Greenland">Greenland</option>
                  <option value="Grenada">Grenada</option>
                  <option value="Guadeloupe">Guadeloupe</option>
                  <option value="Guam">Guam</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Guinea">Guinea</option>
                  <option value="Guyana">Guyana</option>
                  <option value="Haiti">Haiti</option>
                  <option value="Hawaii">Hawaii</option>
                  <option value="Honduras">Honduras</option>
                  <option value="Hong Kong">Hong Kong</option>
                  <option value="Hungary">Hungary</option>
                  <option value="Iceland">Iceland</option>
                  <option value="India">India</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Iran">Iran</option>
                  <option value="Iraq">Iraq</option>
                  <option value="Ireland">Ireland</option>
                  <option value="Isle of Man">Isle of Man</option>
                  <option value="Israel">Israel</option>
                  <option value="Italy">Italy</option>
                  <option value="Jamaica">Jamaica</option>
                  <option value="Japan">Japan</option>
                  <option value="Jordan">Jordan</option>
                  <option value="Kazakhstan">Kazakhstan</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Kiribati">Kiribati</option>
                  <option value="Korea North">Korea North</option>
                  <option value="Korea Sout">Korea South</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Kyrgyzstan">Kyrgyzstan</option>
                  <option value="Laos">Laos</option>
                  <option value="Latvia">Latvia</option>
                  <option value="Lebanon">Lebanon</option>
                  <option value="Lesotho">Lesotho</option>
                  <option value="Liberia">Liberia</option>
                  <option value="Libya">Libya</option>
                  <option value="Liechtenstein">Liechtenstein</option>
                  <option value="Lithuania">Lithuania</option>
                  <option value="Luxembourg">Luxembourg</option>
                  <option value="Macau">Macau</option>
                  <option value="Macedonia">Macedonia</option>
                  <option value="Madagascar">Madagascar</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Malawi">Malawi</option>
                  <option value="Maldives">Maldives</option>
                  <option value="Mali">Mali</option>
                  <option value="Malta">Malta</option>
                  <option value="Marshall Islands">Marshall Islands</option>
                  <option value="Martinique">Martinique</option>
                  <option value="Mauritania">Mauritania</option>
                  <option value="Mauritius">Mauritius</option>
                  <option value="Mayotte">Mayotte</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Midway Islands">Midway Islands</option>
                  <option value="Moldova">Moldova</option>
                  <option value="Monaco">Monaco</option>
                  <option value="Mongolia">Mongolia</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Morocco">Morocco</option>
                  <option value="Mozambique">Mozambique</option>
                  <option value="Myanmar">Myanmar</option>
                  <option value="Nambia">Nambia</option>
                  <option value="Nauru">Nauru</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Netherland Antilles">Netherland Antilles</option>
                  <option value="Netherlands">Netherlands (Holland, Europe)</option>
                  <option value="Nevis">Nevis</option>
                  <option value="New Caledonia">New Caledonia</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Nicaragua">Nicaragua</option>
                  <option value="Niger">Niger</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Niue">Niue</option>
                  <option value="Norfolk Island">Norfolk Island</option>
                  <option value="Norway">Norway</option>
                  <option value="Oman">Oman</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Palau Island">Palau Island</option>
                  <option value="Palestine">Palestine</option>
                  <option value="Panama">Panama</option>
                  <option value="Papua New Guinea">Papua New Guinea</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Peru">Peru</option>
                  <option value="Phillipines">Philippines</option>
                  <option value="Pitcairn Island">Pitcairn Island</option>
                  <option value="Poland">Poland</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Puerto Rico">Puerto Rico</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Republic of Montenegro">Republic of Montenegro</option>
                  <option value="Republic of Serbia">Republic of Serbia</option>
                  <option value="Reunion">Reunion</option>
                  <option value="Romania">Romania</option>
                  <option value="Russia">Russia</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="St Barthelemy">St Barthelemy</option>
                  <option value="St Eustatius">St Eustatius</option>
                  <option value="St Helena">St Helena</option>
                  <option value="St Kitts-Nevis">St Kitts-Nevis</option>
                  <option value="St Lucia">St Lucia</option>
                  <option value="St Maarten">St Maarten</option>
                  <option value="St Pierre &amp; Miquelon">St Pierre &amp; Miquelon</option>
                  <option value="St Vincent &amp; Grenadines">St Vincent &amp; Grenadines</option>
                  <option value="Saipan">Saipan</option>
                  <option value="Samoa">Samoa</option>
                  <option value="Samoa American">Samoa American</option>
                  <option value="San Marino">San Marino</option>
                  <option value="Sao Tome &amp; Principe">Sao Tome &amp; Principe</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Senegal">Senegal</option>
                  <option value="Serbia">Serbia</option>
                  <option value="Seychelles">Seychelles</option>
                  <option value="Sierra Leone">Sierra Leone</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Slovakia">Slovakia</option>
                  <option value="Slovenia">Slovenia</option>
                  <option value="Solomon Islands">Solomon Islands</option>
                  <option value="Somalia">Somalia</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Spain">Spain</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Sudan">Sudan</option>
                  <option value="Suriname">Suriname</option>
                  <option value="Swaziland">Swaziland</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Syria">Syria</option>
                  <option value="Tahiti">Tahiti</option>
                  <option value="Taiwan">Taiwan</option>
                  <option value="Tajikistan">Tajikistan</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Togo">Togo</option>
                  <option value="Tokelau">Tokelau</option>
                  <option value="Tonga">Tonga</option>
                  <option value="Trinidad &amp; Tobago">Trinidad &amp; Tobago</option>
                  <option value="Tunisia">Tunisia</option>
                  <option value="Turkey">Turkey</option>
                  <option value="Turkmenistan">Turkmenistan</option>
                  <option value="Turks &amp; Caicos Is">Turks &amp; Caicos Is</option>
                  <option value="Tuvalu">Tuvalu</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Ukraine">Ukraine</option>
                  <option value="United Arab Erimates">United Arab Emirates</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States of America">United States of America</option>
                  <option value="Uraguay">Uruguay</option>
                  <option value="Uzbekistan">Uzbekistan</option>
                  <option value="Vanuatu">Vanuatu</option>
                  <option value="Vatican City State">Vatican City State</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Virgin Islands (Brit)">Virgin Islands (Brit)</option>
                  <option value="Virgin Islands (USA)">Virgin Islands (USA)</option>
                  <option value="Wake Island">Wake Island</option>
                  <option value="Wallis &amp; Futana Is">Wallis &amp; Futana Is</option>
                  <option value="Yemen">Yemen</option>
                  <option value="Zaire">Zaire</option>
                  <option value="Zambia">Zambia</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                </select>
                <input
                  type='text'
                  id="desc"
                  name="desc"
                  placeholder='Short Description'
                  className='add-data-form-input-insides'
                  required
                  value={playerFormData.desc}
                  onChange={handlePlayerChange}
                />
                {/* Adding photo data please remove if it doesnt work */}
                <input
                  type='file'
                  id="photo"
                  name="photo"
                  accept='image/*'
                  className='add-data-form-input-insides select-photo'
                  required
                  onChange={handlePlayerFileChange}
                />
              </div>
            </span>
            <button type="button" className='player-submit reset-1' onClick={() => setStatus(1)}>Existing Player?</button>
            <button type="submit" className='player-submit' onClick={handlePlayerSubmit}>Submit</button>
          </form>
        </div>
        <div className={`main-form-container ${status === 1 ? 'show' : 'hide'}`}>
          <h2 className='add-data-header'>Add your team</h2>
          <form onSubmit={handleTeamSubmit} className='add-data-form'>
            <span className='add-data-form-container-1'>
              <div className='add-data-form-inputs'>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={teamFormData.name}
                  onChange={handleTeamChange}
                  required
                  placeholder='Enter Team Name'
                  className='add-data-form-input-insides'
                />
                <select
                  type="dropdown"
                  id="player1"
                  name="player1"
                  className='add-data-form-input-insides'
                  value={teamFormData.player1}
                  onChange={handleTeamChange}
                  required>
                  <option value="" disabled>Choose player 1</option>
                  {
                    captainTeam.map(play => (
                      <option key={play.pid} value={play.pid}>{play.pid} {play.pname}</option>
                    ))
                  }
                </select>
                <select
                  type="dropdown"
                  id="player2"
                  name="player2"
                  className='add-data-form-input-insides'
                  value={teamFormData.player2}
                  onChange={handleTeamChange}
                  required
                  disabled={!(teamFormData.player1 !== '')}>
                  <option value="" disabled>Choose player 2</option>
                  {
                    captainTeam.filter(play => play.pid != teamFormData.player1).map(play => (
                      <option key={play.pid} value={play.pid}>{play.pid} {play.pname}</option>
                    ))
                  }
                </select>
                <select
                  type="dropdown"
                  id="player3"
                  name="player3"
                  className='add-data-form-input-insides'
                  value={teamFormData.player3}
                  onChange={handleTeamChange}
                  required
                  disabled={!(teamFormData.player1 !== '') || !(teamFormData.player2 !== '')}>
                  <option value="" disabled={teamFormData.player1 != '' && teamFormData.player2 != ''}>Choose player 3</option>
                  {
                    captainTeam.filter(play => play.pid != teamFormData.player1 && play.pid != teamFormData.player2).map(play => (
                      <option key={play.pid} value={play.pid}>{play.pid} {play.pname}</option>
                    ))
                  }
                </select>

                <input
                  type='text'
                  id="social"
                  name="social"
                  placeholder='Social Id'
                  className='add-data-form-input-insides'
                  required
                  pattern='^@[a-zA-Z0-9_.-]+$'
                  value={teamFormData.social}
                  onChange={handleTeamChange}
                />
                <input
                  type='file'
                  id="photo"
                  name="photo"
                  accept='image/*'
                  className='add-data-form-input-insides select-photo'
                  required
                  onChange={handleTeamFileChange}
                />
              </div>
            </span>
            <button type="button" className='team-submit reset' onClick={() => setStatus(0)}>Add another player?</button>
            <button type="button" className='team-submit reset' onClick={() => handleSkip()}>Already have a team?</button>
            <button type="submit" className='team-submit'>Submit</button>
          </form>
        </div>
        <div className={`main-form-container ${status === 2 ? 'show' : 'hide'}`}>
          <h2 className='add-data-header'>CHoose your Captain</h2>
          <form onSubmit={handleTeamSubmit} className='add-data-form'>
            <span className='add-data-form-container-1'>
              <div className='add-data-form-inputs'>
                <select
                  type="dropdown"
                  id="team"
                  name="team"
                  className='add-data-form-input-insides'
                  value={finalForm.team}
                  onChange={handleFinalTeamChange}
                  required>
                  <option value="" disabled>Choose the team</option>
                  {
                    emptyTeam.map(play => (
                      <option value={play.tname}>{play.tname}</option>
                    ))
                  }
                </select>
                <select
                  type="dropdown"
                  id="captain"
                  name="captain"
                  className='add-data-form-input-insides'
                  value={finalForm.captain}
                  onChange={handleFinalChange}
                  required>
                  <option value="" disabled>Choose Captain</option>
                  {
                    captainSet.map(play => (
                      <option value={play.pid}>{play.pid} {play.pname}</option>
                    ))
                  }
                </select>
                <input
                  type='text'
                  id="nick1"
                  name="nick1"
                  placeholder={'Nickname for ' + finalForm.p1}
                  className='add-data-form-input-insides'
                  required
                  value={finalForm.nick1}
                  onChange={handleFinalChange}
                />

                <input
                  type='text'
                  id="nick2"
                  name="nick2"
                  placeholder={"Nickname for " + finalForm.p2}
                  className='add-data-form-input-insides'
                  required
                  value={finalForm.nick2}
                  onChange={handleFinalChange}
                />
                <input
                  type='text'
                  id="nick3"
                  name="nick3"
                  placeholder={"Nickname for " + finalForm.p3}
                  className='add-data-form-input-insides'
                  required
                  value={finalForm.nick3}
                  onChange={handleFinalChange}
                />
                <input
                  type='text'
                  id="sponsor"
                  name="sponsor"
                  placeholder='Sponsor name'
                  className='add-data-form-input-insides'
                  required
                  value={finalForm.sponsor}
                  onChange={handleFinalChange}
                />
                <input
                  type='number'
                  min="0"
                  max={maxAllowedValue}
                  id="amount"
                  name="amount"
                  placeholder='Sponsor Amount'
                  className='add-data-form-input-insides'
                  required
                  value={number}
                  onChange={handleChange}
                />
              </div>
            </span>
            <button type="submit" className='team-submit' onClick={finalSubmit}>confirm</button>
          </form>
          <div>
            {popupStatus && (
              <div className="popup">
                <div className="popup-content">
                  <p className='merch-title'>Select your merchandise!</p>
                  {/* <form className='form-container-for-merch'> */}
                  <div className='form-for-merch'>
                    {/* Render other elements here if needed */}
                    <input
                      type="text"
                      id="m1"
                      name="m1"
                      required
                      onChange={handleMerchInputChange}
                      placeholder='Enter Merch 1'
                      className='merch-name'
                    />
                    <div>
                      {/* <label className='labels' htmlFor='p1'>Price</label> */}
                      <input id='p1' type="number" className='merch-price' required name='p1' placeholder='Price $' onChange={handleMerchInputChange} min={0} />
                    </div>
                    <div>
                      {/* <label className='labels' htmlFor='q1'>Stock</label> */}
                      <input id='q1' type="number" className='merch-price' required name='q1' placeholder='Stock' onChange={handleMerchInputChange} min={0} />
                    </div>
                  </div>
                  <div className='form-for-merch'>
                    {/* Render other elements here if needed */}
                    <input
                      type="text"
                      id="m2"
                      name="m2"
                      required
                      onChange={handleMerchInputChange}
                      placeholder='Enter Merch 2'
                      className='merch-name'
                    />
                    <div>
                      {/* <label className='labels' htmlFor='p2'>Price</label> */}
                      <input id='p2' type="number" className='merch-price' required name='p2' placeholder='Price $' onChange={handleMerchInputChange} min={0} />
                    </div>
                    <div>
                      {/* <label className='labels' htmlFor='q2'>Stock</label> */}
                      <input id='q2' type="number" className='merch-price' required name='q2' placeholder='Stock' onChange={handleMerchInputChange} min={0} />
                    </div>
                  </div>
                  <div className='form-for-merch'>
                    {/* Render other elements here if needed */}
                    <input
                      type="text"
                      id="m3"
                      name="m3"
                      onChange={handleMerchInputChange}
                      required
                      placeholder='Enter Merch 3'
                      className='merch-name'
                    />
                    <div>
                      {/* <label className='labels' htmlFor='p3'>Price</label> */}
                      <input id='p3' type="number" className='merch-price' required name='p3' placeholder='Price $' onChange={handleMerchInputChange} min={0} />
                    </div>
                    <div>
                      {/* <label className='labels' htmlFor='q3'>Stock</label> */}
                      <input id='q3' type="number" className='merch-price' required name='q3' placeholder='Stock' onChange={handleMerchInputChange} min={0} />
                    </div>
                  </div>
                  <button type='button' onClick={handleMerchSubmit} className='merch-submit'>Submit</button>
                  {/* </form> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>

  );
}

export default AddData;
