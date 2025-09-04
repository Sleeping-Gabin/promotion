## 소개
동원 산업의 메인 페이지를 프로모션 형식으로 제작  
마우스 호버 효과 및 GSAP 애니메이션으로 역동적인 페이지를 구성  
<br>

### 원본 사이트
[동원산업](https://www.dwml.co.kr/)  
모든 사진, 영상 및 콘텐츠 내용의 저작권은 동원산업과 [동원그룹](https://www.dongwon.com/)에 있습니다.  
포트폴리오 목적으로만 사용되었습니다.  
<br>

### 배포 주소
[배포 주소](https://sleeping-gabin.github.io/promotion/)   
<br>

### 기획서
[기획서](https://github.com/Sleeping-Gabin/promotion/raw/main/plan_promotion.pdf)  
<br>

### 사용 기술
![html](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![scss](https://img.shields.io/badge/scss-CC6699.svg?style=for-the-badge&logo=sass&logoColor=white)
![js](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white)
![gsap](https://img.shields.io/badge/gsap-0AE448.svg?style=for-the-badge&logo=gsap&logoColor=white)  
<br>

### 프로젝트 진행 과정
- 2025.07.14 ~ 2025.07.22 : 기획
- 2025.07.22 ~ 2025.07.29 : 개발  

<br><br>

## 페이지
메인 페이지  
|![비주얼 메인](https://github.com/user-attachments/assets/14c353a9-500a-4c72-a3f1-8722feaad979)|![글로벌](https://github.com/user-attachments/assets/6f3c6ca2-779b-46c0-88d5-fa37f591ea61)|![연혁](https://github.com/user-attachments/assets/59a0f26c-fcf6-4409-ab61-f37ac1070763)|  
|:------------:|:---------:|:------:|  

<br><br>

## 구현 내용
### 사업 소개 슬라이드
![사업 소개](https://github.com/user-attachments/assets/5d76e5e3-86b7-46ca-8101-651f27f050fe)

<details>
<summary>코드 보기</summary>

```js
function viewNextInfo() {
  if (viewIdx + 1 >= businesses.length) {
    endView();
    return;
  }

  let businessInfos = businesses[viewIdx+1].querySelectorAll(".business-info p");

  gsap.timeline({
    id: "next",
    onStart: () => animating = true,
    onComplete: () => {
      animating = false;
      viewIdx++;
    },
  }).addLabel("start")
    .fromTo(businesses[viewIdx+1], {
      right: "-100%",
    }, {
      right: 0,
    }, "start")
    .fromTo(businesses[viewIdx], {
      right: 0,
    }, {
      right: "100%",
    }, "start")
    .fromTo(businessInfos, {
      y: 50,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      stagger: 0.2
    });
}
```
</details>

사업 소개 섹션에서 아래로 스크롤 시 사업 아이템이 가로로 슬라이드 된다.  
마지막 아이템일시 배경이 기존 상태로 돌아간다.  
<br>

### ESG 섹션 스크롤
![ESG](https://github.com/user-attachments/assets/6305332f-753f-4437-a631-1804d5ee272e)

<details>
<summary>코드 보기</summary>

```js
function scrollEsg() {
  // ...

  window.addEventListener("wheel", (e) => {
    const bound = esgSection.getBoundingClientRect();
    if (esgState === "downStart" || esgState === "upStart") {
      window.scrollTo(0, fixPoint);
    }

    if (Math.floor(bound.top) <= 0 && esgState !== "downStart" && esgState !== "downEnd" && e.deltaY > 0) {
      // ... 시작 애니메이션

      esgState = "downStart";
    }
    else if (Math.ceil(bound.bottom) >= window.innerHeight && esgState !== "upStart" && esgState !== "upEnd" && e.deltaY < 0) {
      esgState = "upStart";
    }

    if (e.deltaY > 0 && Math.ceil(bound.bottom) >= window.innerHeight && esgState === "upEnd") {
      esgSection.classList.remove("up-scroll");
      esgSection.classList.add("down-scroll");
    }
    else if (e.deltaY < 0 && Math.floor(bound.top) <= 0 && esgState === "downEnd") {
      esgSection.classList.remove("down-scroll");
      esgSection.classList.add("up-scroll");
    }

    // ...
  });

  esgSection.addEventListener("wheel", (e) => {
    if (animating) {
      e.preventDefault();
    }
    else if (esgState === "downStart" || esgState === "upStart") {
      e.preventDefault();
      frame.scrollBy(0, e.deltaY);
    }

    if (esgState === "downStart" && e.deltaY > 0 && Math.ceil(frame.scrollTop + frame.clientHeight) >= frame.scrollHeight) {
      esgSection.classList.remove("down-scroll");
      esgState = "downEnd";
    }
    else if (esgState === "upStart" && e.deltaY < 0 && Math.floor(frame.scrollTop) <= 0) {
      esgSection.classList.remove("up-scroll");
      esgState = "upEnd";
    }
  });
}
```
</details>

스크롤 방향과 경계로 시작과 끝 상태를 판단해서 다음 섹션으로 넘어갈 수 있게 하였다.  
섹션 스크롤 시 일부의 내부 콘텐츠가 스크롤 된다.  
<br>
