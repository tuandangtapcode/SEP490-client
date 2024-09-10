import { Button } from "antd";
import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

export const Title = styled.h1`
  color: #333;
`;

export const Description = styled.p`
  color: #666;
`;

export const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  max-width: 600px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 400px;
object-fit: cover;
`;


export const CardContent = styled.div`
  padding: 20px;
`;


export const CardDescription = styled.p`
  color: #333;
  margin-bottom: 15px;
 display: -webkit-box;
  -webkit-line-clamp: 2; /* Số dòng bạn muốn giới hạn */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledButton = styled(Button)`
  background-color: #1890ff;
  border: none;
  border-radius: 20px;
  color: white;
  &:hover {
    background-color: #40a9ff;
    color: white;
  }
`;