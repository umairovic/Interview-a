import { useEffect, useState } from "react";
import Question from "src/components/Question";
import Survey, { ISurvey } from "../entities/Survey";
import SurveyResponse, { ISurveyResponse } from "../entities/SurveyResponse";
import {Container, Button} from 'react-bootstrap';

interface SurveyProps {
    surveyId: number;
    questions:any;
    setResponse:any
    response:any
}


const CountView = (props: SurveyProps) => {
    // const [response, setResponse] = useState<any>()
    const {setResponse,response} = props
    const [newData, setdata] = useState<any>();
    const [key, setKey] = useState<any>();
    const [values, setValues] = useState<any>();
    const onSurveySubmit = () => {
        
    }   
    // {
    //     question: {
    //         answer : 0
    //     }
    // }
    useEffect(()=>{
        let temp:any = {}
        let keys:any = []
        let val:any = []
        if (response.survey) {
            response.survey.map((data:any, index:any)=>{
                if (!temp[data.content.questions[0].answer] && temp[data.content.questions[0].answer] !== 0) {
                    temp[data.content.questions[0].answer] = 1
                } else {
                    temp[data.content.questions[0].answer] += 1 
                }
            })
      }
      if (temp) {
        for (let [key, value] of Object.entries(temp)) {
            keys.push(key)
            val.push(value)
          }
      }

     const map = new Map(Object.entries(temp));
      console.log(map.values())
      setValues(val)
      setKey(keys)
    },[])

    useEffect(() => {
        const loadSurvey = async (): Promise<void> => {
            const response = await fetch(`http://localhost:2047/api/responses/`);
            let data;
            try {
                data = await response.json();
                // console.log("data",data)
            } catch(error) {
                console.error(error);
                data = null;
            }

            if (response.ok) {
                setResponse(data)
            } else {
                console.error(`API failure: ${response.status}`, data);
            }
        }
        loadSurvey();
    }, []);
    
    let qAndA = null;
    if (response.survey && key) {
        qAndA = key.map((data:any, index:any) => {
            return  <div  style={{border:"1px solid black",padding:"2%"}} key = {index}>
                        <div style={{paddingBottom:"1%"}}>
                            {data}
                        </div>
                        <div style={{textAlign:"center"}}>
                            {values[index]}
                        </div>
                    </div>
        });
    }

    return (
        <Container className="pad-t">
             <div  style={{display:"flex"}}>
            { qAndA }
            </div>
        </Container>
    )
}

export default CountView;
