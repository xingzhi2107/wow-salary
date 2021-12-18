import axios from 'axios';
import {Wcl} from './types/wcl';

const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NTAzYTFlYi1jY2Q4LTRiMDEtOTdmMi1hOTI2N2Y0OThjMzAiLCJqdGkiOiI3Yzk4N2NjN2Y4NTNkOGM1NWJhOTY1MjMwY2Q0YTlhYjNmNGIyNmY2ODcwYzM2ZDQ2NGExYTg2NjQwNTBjOGFjNTk4YzllOGNjMTg2Y2ZlMSIsImlhdCI6MTYzODQyODM3MywibmJmIjoxNjM4NDI4MzczLCJleHAiOjE2NDg3OTYzNzMsInN1YiI6IiIsInNjb3BlcyI6WyJ2aWV3LXVzZXItcHJvZmlsZSIsInZpZXctcHJpdmF0ZS1yZXBvcnRzIl19.Y5QoyD1U7i2REEUcYIkSBzwqmt7ETKTFwUttXrLSoAqHPjugJI54pB8cTYPM_W3h28vpPJHNRxwL1q6B0CsD8WPzgzrbrAuB_kD0--oHOsEUXelr9uBu_K2VDhRXRw4j9BKqE1JioqpWlgr4ourz59Jn8xBoum8Eqz9jeJURTBw7wTIJ3klCgEtt6s365fTcWZE3KKu8KP3ed5u_Tohn9qVTYmmUtpnrUyyoYdjlS7_tSa0GT5Q1G8k9wTFngJnSo8xtCjxWI95kslJ2g8RPBxtZUYZnLOq4wunTsqUkTlFuySKqnW2GVTRm3UczJt9qjVNdJRJETcbSdZhNHF4FTpntemRxmOb9qmBvJcTaH5U7WnYdeiG1fVbubCgiD-GuZpU1VLMT_r1WOHSyn7V6I4nyfcmys_Wv4ZnTZJ_MLDRitDI2dN100M0XJhA3G3PqCwazHAdacDsF4q3EjK5_jKDw-W_VKYX3wlUX5tJBvdUAF8-En5TPVlnPgu-cJ7sFOIRh7njdZdcsGHDVifjnR_rydzXYdmzsNvPggEODpOHyTeg2xqQ8jzc9AD2X3g-azPT73wYzbkixOMOpPGdgmg6C8Eu0wWD4kvmdog_rErTDpBSLT9oZP9FWgoDgC96-KjKQjRbS_iNLOJ9G0Xbjs_SlDzIi7JBVLB3mmIXbKHo';

export function fetchWcl(wclId: string): Promise<{data: Wcl}> {
  const data = {
    query:
      'query refactored65(\n  $code: String!\n  $translate420: Boolean\n  $startTime415: Float\n  $translate144: Boolean\n) {\n  reportData {\n    report(code: $code) {\n      title\n      code\n      masterData {\n        actors {\n          gameID\n          id\n          name\n          server\n          subType\n          type\n        }\n      }\n    startTime\n      playerDetails(startTime: $startTime415, translate: $translate144)\n      fights(translate: $translate420) {\n        id\n        kill\n        name\n        friendlyPlayers\n        classicSeasonID\n        encounterID\n        startTime\n        endTime\n        gameZone {\n          id\n          name\n        }\n      }\n    }\n  }\n}',
    variables: {
      code: wclId,
      translate420: false,
      startTime415: -1,
      translate144: false,
    },
    operationName: 'refactored65',
  };
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  return axios
    .post('https://www.warcraftlogs.com/api/v2/client', data, {
      headers,
    })
    .then(res => res.data);
}
