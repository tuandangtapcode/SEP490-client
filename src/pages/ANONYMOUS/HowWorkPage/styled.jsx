import { Button } from "antd";
import styled from "styled-components";

export const Container = styled.div`
margin-top: -100px;
  padding: 20px;
  text-align: center;
`;

export const StepsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
`;

export const Step = styled.div`
  width: 30%;
    background-color: white;
     border-radius: 30px;
`;

export const Image = styled.img`
  width: 300px;
  height: 250px;
  object-fit: cover; /* This makes the image fill the frame */
 
`;

export const Description = styled.p`
  font-size: 16px;
`;

export const Title = styled.h1`
    background-color: #e0f7fa;
  padding: 60px 60px 90px 60px;
  text-align: center;
`;

export const ActionButton = styled(Button)`
  margin-top: 25px;
  background-color: #40a9ff;
  border: none;
  transition: transform 0.3s, background-color 0.3s; /* Animation effect */

  &:hover {
    background-color: #1890ff;
    transform: scale(1.05); /* Slightly larger on hover */
  }
`;


export const GuaranteeContainer = styled.div`
  background: linear-gradient(to bottom, #e0f7fa, #cce7ff);
  padding: 40px;
  margin-top: 20px;
  border-radius: 10px;
`;

export const GuaranteeTitle = styled.h2`
text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
    margin-top: 15px;
`;

export const GuaranteeDescription = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
`;

export const GuaranteeList = styled.ul`

  padding: 0;
  font-size: 16px;
 margin-left: 100px;
`;

export const GuaranteeItem = styled.li`
  margin-bottom: 10px;
  margin-top: 15px;
  display: flex;
  align-items: center;

  &::before {
    content: '✔';
    color: #40a9ff;
    margin-right: 10px;
  }
`;