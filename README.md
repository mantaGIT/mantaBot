# manta-bot
`만타봇`은 봇 명령어를 통해 스플래툰3 스케줄 정보를 알려주는 디스코드 봇입니다.

기존 인게임 혹은 닌텐도 앱을 통해 확인해야 했던 스케줄 정보를 디스코드 내에서도 빠르게 확인할 수 있도록 돕습니다.

> 데이터 출처 : [splatoon3.ink](https://splatoon3.ink/) / 
[splatoon3.ink Data access](https://github.com/misenhower/splatoon3.ink/wiki/Data-Access)

## Description

현재 스플래툰3의 기본 `5가지` 게임 모드에 대한 스케줄 확인 명령어를 지원합니다.

```md
- /레귤러 : 레귤러 매치
- /챌린지 : 카오폴리스 매치(챌린지)
- /오픈 : 카오폴리스 매치(오픈)
- /엑매 : X 매치
- /연어 : 새먼 런
```

명령어 사용 시 현재 진행 중인 스케줄의 기본 정보를 확인할 수 있습니다.

아래 메뉴바 사용 시 원하는 시간대의 스케줄을 확인할 수 있으며, 버튼을 통해 이전/다음 스케줄을 탐색할 수 있습니다.

<div>
<img width="450" height="450" alt="image" src="https://github.com/user-attachments/assets/817c9b51-f2a9-4f78-9d69-ef35f6fa3e92">
<img width="450" height="450" alt="image" src="https://github.com/user-attachments/assets/99dfcdc7-519b-4f9a-a4dc-284f34e1626c">
</div>


## Project Setup

다음 과정을 따라 본 프로젝트를 직접 실행시켜볼 수 있습니다.
> 본 프로젝트는 [Discord.js](https://github.com/discordjs/discord.js?tab=readme-ov-file)를 기반으로 진행하였습니다.

> [!WARNING]
>
> 프로젝트 실행을 위해서는 `디스코드 봇`이 필요합니다.
>
> [Discord develop portal](https://discord.com/developers/applications)에서 봇 생성 후 서버에 초대하여 준비합니다.

디스코드 봇의 `Client ID`와 `Bot token`을 환경변수로 설정해야 합니다.

프로젝트 루트 디렉토리에 `.env` 파일을 생성 후 다음과 같이 설정합니다.

```env
TOKEN=(place a bot token in this line)
CLIENT_ID=(place a client ID in this line)

SCHED_URL=https://splatoon3.ink/data/schedules.json
LANG_URL=https://splatoon3.ink/data/locale/ko-KR.json
```

`index.js`와 `deploy-commands.js`에서 주석 처리된 아래 코드를 활성화합니다.
```js
require("dotenv").config();
```

### 패키지 설치

```shell
npm install
```

### 봇 실행

```shell
npm run start
```

### 봇 명령어 배포

```shell
npm run deploy
```
