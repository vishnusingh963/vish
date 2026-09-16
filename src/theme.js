// Ant Design theme tokens — keeps ScamShield's "case file" identity
// (paper, ink, hazard yellow, brick red) instead of antd's default blue.
export const colors = {
  ink: '#16140F',
  inkSoft: '#4a463d',
  paper: '#ECE8DD',
  paperRaised: '#F5F2E9',
  line: 'rgba(22, 20, 15, 0.18)',
  lineStrong: 'rgba(22, 20, 15, 0.42)',
  hazard: '#F5B300',
  alert: '#B23A22',
  alertBg: '#F1DAC9',
  safe: '#24523C',
  safeBg: '#DCE6D3',
};

export const theme = {
  token: {
    colorPrimary: colors.ink,
    colorLink: colors.alert,
    colorLinkHover: colors.ink,
    colorText: colors.ink,
    colorTextSecondary: colors.inkSoft,
    colorBgBase: colors.paper,
    colorBgContainer: colors.paperRaised,
    colorBorder: colors.lineStrong,
    colorBorderSecondary: colors.line,
    colorSuccess: colors.safe,
    colorSuccessBg: colors.safeBg,
    colorError: colors.alert,
    colorErrorBg: colors.alertBg,
    colorWarning: colors.hazard,
    fontFamily: '"Archivo", sans-serif',
    fontFamilyCode: '"IBM Plex Mono", monospace',
    borderRadius: 0,
    wireframe: false,
  },
  components: {
    Button: {
      borderRadius: 0,
      controlHeight: 46,
      fontFamily: '"IBM Plex Mono", monospace',
      primaryShadow: 'none',
    },
    Input: {
      borderRadius: 0,
      colorBgContainer: colors.paper,
    },
    Card: {
      borderRadiusLG: 0,
    },
    Steps: {
      colorPrimary: colors.alert,
    },
    Tag: {
      borderRadiusSM: 0,
    },
    Skeleton: {
      borderRadiusSM: 0,
    },
  },
};
