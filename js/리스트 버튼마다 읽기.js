$(document).ready(function () {
    displayData();
});

// 이전에 클릭한 버튼의 상태를 저장하는 변수
var previousStatus = "";

// 초기 데이터 출력 함수
function displayData() {
    $.getJSON("./json/Gdata3.json", function (data) {
        // 초기에는 이전에 클릭한 버튼의 상태에 따라 데이터를 렌더링
        renderData(data, previousStatus);
    });
}

// 버튼 클릭 시 스타일 및 데이터 필터링 함수
function buttonClick(status, buttonElement) {
    if (previousStatus === status) {
        // 이미 클릭된 상태일 때는 클릭을 해제하고 스타일을 원래대로 변경
        previousStatus = "";
        $(".filter-btn").removeClass("btn-on");
    } else {
        // 클릭되지 않은 상태일 때는 클릭을 설정하고 스타일을 변경
        previousStatus = status;
        $(".filter-btn").removeClass("btn-on");
        $(buttonElement).addClass("btn-on");
    }
    renderData(data, previousStatus);
}

// 검색 버튼 클릭 시 이전에 클릭한 버튼의 상태에 따라 데이터 필터링 함수
function searchData() {
    $.getJSON("./json/Gdata3.json", function (data) {
        // 이전에 클릭한 버튼의 상태에 따라 데이터 필터링
        renderData(data, previousStatus);
    });
}

function showAllData() {
    previousStatus = ""; 
    $(".filter-btn").removeClass("btn-on");
    renderData(data, "");
}

function resetSelection() {
    $(".filter-checkbox").prop('checked', false);
    $(".filter-btn").removeClass("btn-on");
    renderData(data, []);
}

// 데이터를 화면에 렌더링하는 함수
function renderData(data, status) {
    var currentDate = new Date();

    let member_data = "";
    $.each(data, function (key, value) {
        var 진행일정 = value.진행일정;
        var startDate, endDate;

        if (진행일정 && 진행일정 !== "~") {
            [startDate, endDate] = 진행일정.split(" ~ ");
        }

        if (진행일정 === "~" && value.신청기간 === "~") {
            // 정규표현식을 사용하여 상세정보에서 진행일정과 신청기간 추출
            var detail_info = value.상세정보;
            var match_schedule = detail_info.match(/일시\s*:\s*([^\n]+)/);
            var match_schedule2 = detail_info.match(/일 시\s*:\s*([^\n]+)/);
            var match_schedule3 = detail_info.match(/기간\s*:\s*([^\n]+)/);

            if (match_schedule || match_schedule2 || match_schedule3) {
                member_data += "<div class='info-box'>";
                member_data += "<p style='font-size: 20px;'><strong>" + value.정책이름 + "</strong></p>";
                member_data += "<p><strong>신청기간</strong>: " + (value.신청기간 || "미정") + "</p>";
                member_data += "<p><strong>진행일정</strong>: " + (value.진행일정 || "미정") + "</p>";
                member_data += "<p><strong>담당기관</strong>: " + value.담당기관 + "</p>";
                member_data += "<p><strong>지원대상</strong>: " + value.지원대상 + "</p>";

                if (match_schedule || match_schedule2) {
                    member_data += "<p><strong>상세정보의 일정</strong>: " + (match_schedule ? match_schedule[1] : match_schedule2[1]) + "</p>";
                }

                if (match_schedule3) {
                    member_data += "<p><strong>상세정보의 추가일정</strong>: " + match_schedule3[1] + "</p>";
                }

                member_data += "</div>";
            }
        }


        // 각 버튼에 대한 조건문
        if (!status || (status === "모집중" && (!진행일정 || 진행일정 === "~" || (currentDate >= new Date(startDate) && currentDate <= new Date(endDate)))) || 
            (status === "금정구" && (value.담당기관.includes("금정구") || value.담당기관.includes("스타트허브"))) || 
            (status === "사하구" && value.담당기관.includes("사하")) || 
            (status === "해운대구" && value.담당기관.includes("해운대")) ||
            (status === "연제구" && value.담당기관.includes("연제구")) ||
            (status === "수영구" && value.담당기관.includes("수영구")) ||
            (status === "사상구" && value.담당기관.includes("사상구")) ||
            (status === "부산진구" && value.담당기관.includes("부산진구")) ||
            (status === "기장군" && value.담당기관.includes("기장군")) ||
            (status === "영도구" && value.담당기관.includes("영도")) ||
            (status === "동구" && value.담당기관.includes("동구")) ||
            (status === "서구" && value.담당기관.includes("서구")) ||
            (status === "남구" && value.담당기관.includes("남구")) ||
            (status === "북구" && value.담당기관.includes("북구")) ||
            (status === "대학생" && value.지원대상.includes("대학생")) ||
            (status === "기타" && value.지원대상.includes("기타")) ||
            (status === "제한없음" && value.지원대상.includes("제한없음"))) {
            member_data += "<div class='info-box'>";
            member_data += "<p style='font-size: 20px;'><strong>" + value.정책이름 + "</strong></p>";
            member_data += "<p><strong>신청기간</strong>: " + (value.신청기간 || "미정") + "</p>";
            member_data += "<p><strong>진행일정</strong>: " + (value.진행일정 || "미정") + "</p>";
            member_data += "<p><strong>담당기관</strong>: " + value.담당기관 + "</p>";
            member_data += "<p><strong>지원대상</strong>: " + value.지원대상 + "</p>";
            member_data += "<p><strong>홈페이지</strong>: <a href='" + value.홈페이지 + "' target='_blank'>" + value.홈페이지 + "</a></p>";
            member_data += "</div>";
        }
    });

    $("#data-container").html(member_data);
}