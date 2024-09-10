import styled from "styled-components"


export const LoginContainerStyled = styled.div`
max-width: 30%;
margin: auto;
/* height: 70vh; */
.icon-google {
  background: url(https://accounts.scdn.co/sso/images/new-google-icon.72fd940a229bc94cf9484a3320b3dccb.svg) center center no-repeat;
  width: 1.5rem;
  height: 1.5rem;
  margin-left: 10px;
}

.icon-facebook {
  background: url("https://accounts.scdn.co/sso/images/new-facebook-icon.eae8e1b6256f7ccf01cf81913254e70b.svg") center center no-repeat;
  width: 1.5rem;
  height: 1.5rem;
  margin-left: 10px;
}
.login-google {
  background-color: white !important;
  border-color: #dadce0 !important;
  padding: 18px;
  border-radius: 20px;
  width: 100%;
  &:hover {
    color: black !important;
  }
}

.login-facebook {
  background-color: #4185f4 !important;
  border-color: transparent !important;
  width: 100%;
  &:hover {
    color: black !important;
  }
}
`