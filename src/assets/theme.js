const colors = {
  cliqueBlue: "#0f3764",
  black: "#323643",
  white: "#FFFFFF",
  grey: "darkgrey",
  grey2: "grey",
  lightgrey: "lightgrey",
  light_chat_mine: "#effedd",
  light_chat_yours: "white",
  light_chat_background: "#87b3e2",
  light_chat_username: "#3e5d76",
  dark_chat_mine: "#3e6189",
  dark_chat_yours: "#2f3f4f",
  dark_chat_background: "#151e27",
  dark_chat_username: "#8fc5f1",
  green: "#65c681",
  red: "#c13f3f",
  poll_blue: "#1965BC"
};

const cliqueBlue = "#0f3764";

const lightColors = {
  cliqueBlue,
  main: cliqueBlue,
  lightMain: "#fff",
  chatList: "#fff",
  textColor: "#000",
  chatBackground: "#87b3e2",
  shadow: "#323643",
  whiteBlack: "#fff",
  systemMsgBubble: "#2474f7",
  myMsgBubble: "#effedd",
  yourMsgBubble: "#fff",
  chatUsername: "#3e5d76",
  chatButtons: cliqueBlue,
  keyboard: "light",
  headerColor: cliqueBlue,
  placeholderColor: "lightgrey",
  lastMsgUsername: cliqueBlue,
  pollMsgTop: "#1965BC",
  pollMsgBottom: "#fff",
  pollItemTitle: cliqueBlue,
  pollBar: "#1965BC",
  pollVoter: "#87A4C6",
  pollTitle: cliqueBlue,
  eventResponders: cliqueBlue,
  hairlineColor: "#CCC",
  touchOpacity: 0.2,
  continueButton: "#134782",
  dayTextColor: "#2d4150",
  dotColor: "#134782",
  agendaBackground: "#F2F2F2",
  textSectionTitleColor: "#b6c1cd",
  textDisabledColor: "#d9e1e8",
  todayColor: "#00adf5",
  spinnerBg: "#F5FCFF88",
};

const darkColors = {
  cliqueBlue: "#061729",
  main: "#000",
  lightMain: "#1F1F1F",
  chatList: "#000",
  textColor: "#fff",
  chatBackground: "#1b1c1e",
  shadow: "#fff",
  whiteBlack: "#000",
  systemMsgBubble: "#2f3f4f",
  myMsgBubble: "#3e6488",
  yourMsgBubble: "#262d33",
  chatUsername: "#20E2CD",
  chatButtons: "#9A9A9A",
  keyboard: "dark",
  headerColor: "#25292c",
  placeholderColor: "#989898",
  lastMsgUsername: "#fff",
  pollMsgTop: "#2EE09C",
  pollMsgBottom: "#9A9A9A",
  pollItemTitle: "#9A9A9A",
  pollBar: "#2EE09C",
  pollVoter: "#686868",
  pollTitle: "#fff",
  eventResponders: "#1965BC",
  hairlineColor: "#1f1f1f",
  touchOpacity: 0.8,
  continueButton: "#1F1F1F",
  dayTextColor: "#b6c1cd",
  dotColor: "#3C7CC7",
  agendaBackground: "#000",
  textSectionTitleColor: "#fff",
  textDisabledColor: "#434343",
  todayColor: "#70CCCF",
  spinnerBg: "#43434388",
};

const sizes = {
  // global sizes
  base: 16,
  font: 14,
  radius: 6,
  padding: 25,

  // font sizes
  h1: 26,
  h2: 20,
  h3: 18,
  h4: 17,
  title: 18,
  header: 16,
  body: 14,
  caption: 12
};

const fonts = {
  h1: {
    fontSize: sizes.h1
  },
  h2: {
    fontSize: sizes.h2
  },
  h3: {
    fontSize: sizes.h3
  },
  header: {
    fontSize: sizes.header
  },
  title: {
    fontSize: sizes.title
  },
  body: {
    fontSize: sizes.body
  },
  caption: {
    fontSize: sizes.caption
  }
};

export default { colors, sizes, fonts, lightColors, darkColors };
