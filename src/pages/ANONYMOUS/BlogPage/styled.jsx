import { Button } from "antd";
import styled, { keyframes } from "styled-components";

// Định nghĩa hiệu ứng fade-in
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const Container = styled.div`
  padding: 20px;
  ${'' /* text-align: center; */}
`;

export const Title = styled.h1`
  text-align: center;
  color: #333;
  animation: ${fadeIn} 2s ease-in-out;
`;

export const Description = styled.p`
  color: #666;
  font-size: 1.1em;
  animation: ${fadeIn} 2s ease-in-out;
`;

export const StyledListItem = styled.div`
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: scale(1.05);  // Tăng kích thước của item khi hover
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);  // Tạo bóng đổ khi hover
  }
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
  -webkit-line-clamp: 2;
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
