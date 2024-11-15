import styled from "styled-components";

export const Box = styled.footer`
  background-color: #333;
  color: #fff;
  padding: 20px 0;
  width: 100%;
  position: relative; /* Change to relative */
  bottom: 0;
  text-align: center;
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const Column = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const FooterLink = styled.a`
  color: #fff;
  text-decoration: none;
  margin: 0 15px;
  display: flex;
  align-items: center;
  font-size: 16px;

  &:hover {
    color: #f1c40f;
  }
`;

export const Heading = styled.h1`
  font-size: 24px;
  color: #fff;
`;
