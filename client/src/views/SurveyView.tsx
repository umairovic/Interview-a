import { useEffect, useState } from "react";
import Question from "src/components/Question";
import Survey, { ISurvey } from "../entities/Survey";
import SurveyResponse, { ISurveyResponse } from "../entities/SurveyResponse";
import {Container, Button} from 'react-bootstrap';

interface SurveyProps {
    surveyId: number;
    incrementFunction: any;
    setSurveyResponse:any;
    surveyResponse:any;
    survey:any;
    setCount:any;
    count:any;
}

const SurveyView = (props: any) => {
    const {survey,setSurveyResponse, surveyResponse,setCount,count} = props
    const [questionInd, setQuestionInd] = useState(0);
   
    const onSurveySubmit = () => {
        if (surveyResponse?.content.questions) {
            let check = {...count}
            check[surveyResponse?.content?.questions[questionInd]?.answer] += 1
            setCount(check)
            props.incrementFunction(check)
            surveyResponse.content.questions[questionInd].response = check 
            }

 
        const saveSurvey = async (): Promise<void> => {
            const response = await fetch(
                `http://localhost:2047/api/responses/`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({response: surveyResponse})
                }
            );

            if (!response.ok) {
                console.error(`API failure: ${response.status}`, await response.json());
            }
        };

        // TODO: Saving state
        console.log("Saving...");
        saveSurvey();
        console.log("done.");
    }

    const onSurveySelection = (question: string, answer: string) => {
        if (surveyResponse == null) return;
        const index = surveyResponse?.content?.questions?.findIndex((value:any) => {
            return value.question === question;
        });
     
        if (index < 0) {
            setQuestionInd(0)
            surveyResponse.content.questions.push({question: question, answer: answer, response: {count} });
        } else {
            setQuestionInd(index)
            surveyResponse.content.questions[index].answer = answer;
        }

        setSurveyResponse(surveyResponse);
    };

    let qAndA = null;
    if (survey) {
        qAndA = survey.content.questions.map((question: any, index:any) => {
            return <Question question={ question }
                             onSelection={ onSurveySelection }
                             key={ index } />
        });
    }

    return (
        <Container className="pad-t">
            <h1>Survey {props.surveyId}</h1>
            { qAndA }
            <Button
                className="text-uppercase"
                variant="success"
                block={true}
                onClick={event => {
                    event.stopPropagation();
                    onSurveySubmit(); }}
            >
                Respond!
            </Button>
        </Container>
    )
}

export default SurveyView;
