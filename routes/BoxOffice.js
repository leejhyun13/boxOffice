const axios = require('axios');
const dotenv = require('dotenv');
const express = require('express');
const commentService = require('../service/commentService');

const router = express.Router();
const currentDate = new Date();

// 현재 날짜를 가져와 어제 날짜 만들기
const yesterday = new Date(currentDate);
yesterday.setDate(currentDate.getDate() - 1);

// 날짜 yyyyMMdd 형식으로 변환
const year = yesterday.getFullYear();
const month = String(yesterday.getMonth() + 1).padStart(2, '0');
const day = String(yesterday.getDate()).padStart(2, '0');
const formattedDate = `${year}${month}${day}`;

dotenv.config();

// API 키 (자신의 API 키로 교체해야 함)
const apiKey = process.env.SECRET_KEY;

// KOFIC 오픈 API 엔드포인트 URL
const dailyBoxOfficeList = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/
searchDailyBoxOfficeList.json?key=${apiKey}&targetDt=${formattedDate}`;

// 일간 박스오피스 조회
router.get('/dailyBoxOfficeList', (req, res) => {
  // KOFIC 오픈 API에 GET 요청 보내기
  axios.get(dailyBoxOfficeList)
    .then((response) => {
      // 응답 데이터 처리
      const movies = response.data.boxOfficeResult.dailyBoxOfficeList.map((movie) => ({
        순위: movie.rank,
        제목: movie.movieNm,
        개봉일자: movie.openDt,
        영화코드: movie.movieCd,
        당일관객수: `${Number(movie.audiCnt).toLocaleString()}명`,
        누적관객수: `${Number(movie.audiAcc).toLocaleString()}명`,
      }));
      res.status(200).json(movies); // 응답 데이터를 클라이언트에게 전송
    })
    .catch((err) => {
      res.status(500).json({ error: 'Error fetching data', message: err.message }); // 오류 메시지를 클라이언트에게 전송
    });
});

// 영화 상세 조회
router.get('/movieDetail/:movieCode', async (req, res) => {
  try {
    const { movieCode } = req.params;

    // 영화 상세 정보를 조회하는 API 호출
    const movieDetailUrl = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${apiKey}&movieCd=${movieCode}`;
    const movieDetailResponse = await axios.get(movieDetailUrl);
    const movieDetailData = movieDetailResponse.data;

    // API 응답 데이터에서 필요한 영화 정보 추출
    const {
      movieNm, movieNmEn, nations, prdtYear, openDt, showTm, typeNm, directors, actors, audits,
    } = movieDetailData.movieInfoResult.movieInfo;

    // 배역명과 출연배우 정보 추출
    const castAndActors = actors.map((actor) => ({
      출연배우: actor.peopleNm,
      배역명: actor.cast || '', // 배역명이 없는 경우 빈 문자열로 처리
    }));

    // 필요한 정보를 객체로 구성하여 클라이언트에게 전송
    const movieInfo = {
      제목: movieNm,
      '제목(영문)': movieNmEn,
      제작국가: nations.map((nation) => nation.nationNm), // 국가 정보는 배열 형태로 추출
      제작연도: prdtYear,
      개봉연도: openDt,
      상영시간: showTm,
      영화유형: typeNm,
      감독: directors.map((director) => director.peopleNm), // 감독 정보는 배열 형태로 추출
      출연정보: castAndActors, // 출연배우와 배역명 정보를 함께 포함
      심의정보: audits.map((audit) => audit.watchGradeNm), // 심의 정보는 배열 형태로 추출
    };

    // 해당 영화에 해당하는 댓글들을 조회하여 클라이언트에게 전송
    const comments = await commentService.commentList(movieCode);

    const simplifiedComments = comments.map((comment) => ({
      닉네임: comment.nickname,
      내용: comment.content,
    }));

    // 영화 정보와 댓글 정보를 함께 클라이언트에게 전송
    res.status(200).json({ movieInfo, simplifiedComments });
  } catch (err) {
    // 오류가 발생한 경우 오류 메시지를 클라이언트에게 전송
    res.status(500).json({ error: 'Error fetching data', message: err.message });
  }
});

module.exports = router;
