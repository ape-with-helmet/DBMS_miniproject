import React, { useEffect, useState } from 'react';
import '../css/AddData.css'
import axios from 'axios';

function AddData() {
  const [status, setStatus] = useState(0);
  const [captainTeam, setCaptainTeam] = useState([])
  const [captainSet, setCaptainSet] = useState([])
  const [playerFormData, setPlayerFormData] = useState({
    name: '',
    dob: '',
    sex: '',
    origin: '',
    desc: ''
  });
  const [finalForm, setFinalForm] = useState({
    team: '',
    captain: ''
  });
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    player1: '',
    player2: '',
    player3: '',
    trank: '',
    social: ''
  });
  const [emptyTeam, setEmptyTeam] = useState([])
  useEffect(() => {
    async function getEmptyTeam() {
      try {
        const response = await axios.get("http://localhost:8080/get_notfullteams");
        setCaptainTeam(response.data); // Update state with response.data
      } catch (error) {
        console.error("Error fetching empty teams:", error);
      }
    }
    getEmptyTeam();
  }, []); // Empty dependency array to ensure this effect runs only once on component mount
  useEffect(() => {
    async function getEmptyCap() {
      try {
        const response = await axios.get("http://localhost:8080/get_blank_team");
        setEmptyTeam(response.data); // Update state with response.data
      } catch (error) {
        console.error("Error fetching empty teams:", error);
      }
    }
    getEmptyCap();
  }, []); // Empty dependency array to ensure this effect runs only once on component mount
  useEffect(() => {
    // Log emptyTeam after it's updated
    setEmptyTeam(emptyTeam);
  }, [emptyTeam]);
  const handlePlayerChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'file' ? e.target.files[0] : value;
    console.log(playerFormData)
    setPlayerFormData(prevState => ({
      ...prevState,
      [name]: val
    }));
  };
  const handleTeamChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'file' ? e.target.files[0] : value;
    setTeamFormData(prevState => ({
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
    const response = await axios.post("http://localhost:8080/given_team_players", {
      id: value
    })
    setCaptainSet(response.data)
    setFinalForm(prevState => ({
      ...prevState,
      [name]: val
    }));
  };

  const handlePlayerSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., send data to server
    console.log(playerFormData)
    await axios.post("http://localhost:8080/add_player_data", {
      id: playerFormData
    })
    alert("Successful")
    setPlayerFormData({
      name: '',
      dob: '',
      sex: '',
      origin: '',
      desc: ''
    })
    setStatus(1);
  };
  const handleTeamSubmit = async (e) => {
    console.log("finalForm")
    e.preventDefault();
    await axios.post("http://localhost:8080/add_team_data", {
      id: teamFormData
    })
    // Handle form submission logic here, e.g., send data to server
    setStatus(2);
    setTeamFormData({
      name: '',
      player1: '',
      player2: '',
      player3: '',
      trank: '',
      social: ''
    })
    console.log(teamFormData, "FormData");
  };
  const finalSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., send data to server
    console.log(finalForm,"gaga")
    await axios.post("http://localhost:8080/add_captain", {
      id: finalForm
    })
    setStatus(0);
    setFinalForm({
      captain: '',
      team: ''
    })
    console.log(finalForm, "FormData");
  };

  return (
    <div className='main-div' >
      <div className={`conditional-com-1 ${status === 0 ? 'show' : status === 1 ? 'hide' : 'show-cap'}`}>
        <div className=''>
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
              </div>
            </span>
            <button type="button" className='player-submit reset-1' onClick={() => setStatus(1)}>Existing Player?</button>
            <button type="submit" className='player-submit' onClick={() => handlePlayerSubmit()}>Submit</button>
          </form>
          '  </div>'
        <br />
        <br />
        <br />
        <br />
        <br />
        <div>
          <h2 className='add-data-header'>Add your team</h2>
          <form onSubmit={handleTeamSubmit} className='add-data-form'>
            <span className='add-data-form-container-2'>
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
                      <option value={play.pid}>{play.pid} {play.pname}</option>
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
                  required>
                  <option value="" disabled>Choose player 2</option>
                  {
                    captainTeam.map(play => (
                      <option value={play.pid}>{play.pid} {play.pname}</option>
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
                  required>
                  <option value="" disabled>Choose player 3</option>
                  {
                    captainTeam.map(play => (
                      <option value={play.pid}>{play.pid} {play.pname}</option>
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
                  value={teamFormData.social}
                  onChange={handleTeamChange}
                />
                <input
                  type='text'
                  id="trank"
                  name="trank"
                  placeholder='Ranking'
                  className='add-data-form-input-insides'
                  required
                  value={teamFormData.trank}
                  onChange={handleTeamChange}
                />
              </div>
            </span>
            <button type="button" className='team-submit reset' onClick={() => setStatus(0)}>Add another player?</button>
            <button type="submit" className='team-submit' onClick={() => handleTeamSubmit()}>Submit</button>
          </form>
        </div>
        <br />
        <br />
        <br />
        <br />
        <div >
          <h2 className='add-data-header'>CHoose your Captain</h2>
          <form onSubmit={handleTeamSubmit} className='add-data-form'>
            <span className='add-data-form-container-2'>
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
              </div>
            </span>
            <button type="submit" className='team-submit' onClick={finalSubmit}>confirm</button>
          </form>
        </div>
      </div>

    </div>
  );
}

export default AddData;
