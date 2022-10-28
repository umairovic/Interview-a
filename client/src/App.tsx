import React, { useState,useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import SurveyView from "./views/SurveyView"
import CountView from "./views/CountView";
import Survey, { ISurvey }  from "./entities/Survey";
import SurveyResponse, { ISurveyResponse } from "./entities/SurveyResponse";
import {Container, Button} from 'react-bootstrap';

function App() {
  const [counter, setCounter] = React.useState()
  const [survey, setSurvey] = useState<ISurvey | null>(null);
  const [surveyResponse, setSurveyResponse] = useState<ISurveyResponse| null>(null);
  const [count,setCount] = useState<any>()

  
  useEffect(() => {
    const loadSurvey = async (): Promise<void> => {
        const response = await fetch(`http://localhost:2047/api/surveys/1`);
        let data;
        try {
            data = await response.json();
        } catch(error) {
            console.error(error);
            data = null;
        }

        if (response.ok) {
            setSurvey(new Survey(data.survey))
            setSurveyResponse(new SurveyResponse(data.survey.id))
        } else {
            console.error(`API failure: ${response.status}`, data);
        }
    }
    // TODO: Loading state
    console.log("loading...");
    loadSurvey();
    console.log("done.");
}, []);

useEffect(()=>{
  let temp : any = {}
  survey?.content.questions.map((data)=>{
      for (const [key, value] of Object.entries(data.response)) {
      temp[key] = value
    }
  })
  setCount(temp)
},[survey])


  const incrementFunction = (data: any) => {
    // console.log("check",data)
    setCounter(data)
  }

  return (
    <Router>
      <Container className="main pad-t">
        <Link to="/survey/1">
          <Button className="text-uppercase" variant="secondary" block={true}>
              Take a Survey
          </Button>
        </Link>
        <Link to="/count">
          <Button className="text-uppercase" variant="secondary" block={true}>
              Total Responses
          </Button>
        </Link>
        <Switch>
          <Route path="/survey">
            <SurveyView 
            surveyId={1} 
            incrementFunction={incrementFunction} 
            setSurveyResponse={setSurveyResponse} 
            surveyResponse={surveyResponse} 
            setCount={setCount}
            count={count}
            survey={survey}/>
          </Route>
          <Route path="/count">
            <CountView />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
