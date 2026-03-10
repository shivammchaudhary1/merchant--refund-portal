import { Box } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

const mulShdSpin = keyframes`
0%,100% {
  box-shadow: 0em -2.6em 0em 0em #134581, 1.8em -1.8em 0 0em rgba(19,69,129,0.2),
  2.5em 0em 0 0em rgba(19,69,129,0.2), 1.75em 1.75em 0 0em rgba(19,69,129,0.2),
  0em 2.5em 0 0em rgba(19,69,129,0.2), -1.8em 1.8em 0 0em rgba(19,69,129,0.2),
  -2.6em 0em 0 0em rgba(19,69,129,0.5), -1.8em -1.8em 0 0em rgba(19,69,129,0.7);
}
12.5% {
  box-shadow: 0em -2.6em 0em 0em rgba(19,69,129,0.7), 1.8em -1.8em 0 0em #134581,
  2.5em 0em 0 0em rgba(19,69,129,0.2), 1.75em 1.75em 0 0em rgba(19,69,129,0.2),
  0em 2.5em 0 0em rgba(19,69,129,0.2), -1.8em 1.8em 0 0em rgba(19,69,129,0.2),
  -2.6em 0em 0 0em rgba(19,69,129,0.2), -1.8em -1.8em 0 0em rgba(19,69,129,0.5);
}
25% {
  box-shadow: 0em -2.6em 0em 0em rgba(19,69,129,0.5), 1.8em -1.8em 0 0em rgba(19,69,129,0.7),
  2.5em 0em 0 0em #134581, 1.75em 1.75em 0 0em rgba(19,69,129,0.2),
  0em 2.5em 0 0em rgba(19,69,129,0.2), -1.8em 1.8em 0 0em rgba(19,69,129,0.2),
  -2.6em 0em 0 0em rgba(19,69,129,0.2), -1.8em -1.8em 0 0em rgba(19,69,129,0.2);
}
50% {
  box-shadow: 0em -2.6em 0em 0em rgba(19,69,129,0.2), 1.8em -1.8em 0 0em rgba(19,69,129,0.2),
  2.5em 0em 0 0em rgba(19,69,129,0.5), 1.75em 1.75em 0 0em rgba(19,69,129,0.7),
  0em 2.5em 0 0em #134581, -1.8em 1.8em 0 0em rgba(19,69,129,0.2),
  -2.6em 0em 0 0em rgba(19,69,129,0.2), -1.8em -1.8em 0 0em rgba(19,69,129,0.2);
}
75% {
  box-shadow: 0em -2.6em 0em 0em rgba(19,69,129,0.2), 1.8em -1.8em 0 0em rgba(19,69,129,0.2),
  2.5em 0em 0 0em rgba(19,69,129,0.2), 1.75em 1.75em 0 0em rgba(19,69,129,0.2),
  0em 2.5em 0 0em rgba(19,69,129,0.5), -1.8em 1.8em 0 0em rgba(19,69,129,0.7),
  -2.6em 0em 0 0em #134581, -1.8em -1.8em 0 0em rgba(19,69,129,0.2);
}
`;

const StyledLoader = styled(Box)({
  fontSize: "10px",
  width: "1em",
  height: "1em",
  borderRadius: "50%",
  position: "relative",
  textIndent: "-9999em",
  transform: "translateZ(0)",
  animation: `${mulShdSpin} 1.1s infinite ease`,
});

const Loader = () => {
  return <StyledLoader />;
};

export default Loader;
