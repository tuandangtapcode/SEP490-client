import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
`;

export const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    height: auto;
    border-radius: 30px 120px 30px 0px;
  }
`;

export const ContentContainer = styled.div`
  flex: 2;
  padding-left: 20px;
`;

export const Quote = styled.p`
  font-size: 1.2em;
  font-style: italic;
  color: #000;
  margin: 0 0 10px 0;
`;

export const Author = styled.p`
  font-size: 1em;
  font-weight: bold;
  color: #000;
  margin: 0 0 20px 0;
`;

export const Button = styled.button`
  background-color: #1890ff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;

  &:hover {
    background-color: #40a9ff;
  }
`;

export const SectionContainer = styled.div`
  background-color: #fff;
  padding: 40px 20px;
  text-align: center;
`;

export const Title = styled.h2`
  font-size: 1.8em;
  font-weight: bold;
  margin-bottom: 30px;
`;

export const ItemsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`;

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 200px;
  margin-bottom: 30px;
`;

export const IconContainer = styled.div`
  font-size: 2em;
  color: #1890ff;
  margin-bottom: 10px;
`;

export const ItemTitle = styled.h3`
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const ItemText = styled.p`
  font-size: 1em;
  color: #666;
  text-align: center;
`;