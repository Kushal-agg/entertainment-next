import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Container, Row, Column, FooterLink } from "./FooterStyles";
import {
  faYoutube,
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <Box>
      <Container>
        <Row>
          <Column>
            <FooterLink href="#">
              <FontAwesomeIcon icon={faFacebook} size="1x" />
              <span style={{ marginLeft: "10px", marginRight: "10px" }}>
                Facebook
              </span>
            </FooterLink>
            <FooterLink href="#">
              <FontAwesomeIcon icon={faInstagram} size="1x" />
              <span style={{ marginLeft: "10px", marginRight: "10px" }}>
                Instagram
              </span>
            </FooterLink>
            <FooterLink href="#">
              <FontAwesomeIcon icon={faTwitter} size="1x" />
              <span style={{ marginLeft: "10px", marginRight: "10px" }}>
                Twitter
              </span>
            </FooterLink>
            <FooterLink href="#">
              <FontAwesomeIcon icon={faYoutube} size="1x" />
              <span style={{ marginLeft: "10px", marginRight: "10px" }}>
                Youtube
              </span>
            </FooterLink>
          </Column>
        </Row>
      </Container>
    </Box>
  );
};

export default Footer;
