
import { buttonClick, toggleTab } from '../common/ui.js'

// sideNav
document.querySelectorAll('.nav-sec').forEach((sec) => {
		const summary = sec.querySelector('summary');
		if (!summary) return;

		const addCaps = () => {
			if (!summary.querySelector('.round-top')) {
				summary.insertAdjacentHTML(
					'afterbegin',
					'<em class="round-top" aria-hidden="true"></em>' +
					'<em class="round-bottom" aria-hidden="true"></em>'
				);
			}
		};
		const removeCaps = () => {
			summary.querySelectorAll('.round-top, .round-bottom').forEach(el => el.remove());
		};
		const sync = () => (sec.open ? addCaps() : removeCaps());

		sync();
		sec.addEventListener('toggle', sync);
});


//Modal
document.addEventListener("DOMContentLoaded", () => {
  function openModal(id) {
    document.getElementById(id).classList.add("active");
  }
  function closeModal(id) {
    document.getElementById(id).classList.remove("active");
  }

  window.openModal = openModal;
  window.closeModal = closeModal;

  // form 모달이 많아 불편해서 제거 
  // 배경 클릭 시 닫기
  // document.addEventListener("click", function(e) {
  //   if (e.target.classList.contains("modal")) {
  //     e.target.classList.remove("active");
  //   }
  // });

  // ESC 키로 닫기
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.active").forEach(modal => {
        modal.classList.remove("active");
      });
    }
  });
});	


// Tab
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tab--container").forEach(initTabGroup);
});

function initTabGroup(groupEl) {
  const tabs   = groupEl.querySelectorAll(".tab--item");
  const panels = groupEl.querySelectorAll(".tab--panel");

  groupEl.addEventListener("click", (e) => {
    const tab = e.target.closest(".tab--item");
    if (!tab || !groupEl.contains(tab)) return;

    const targetId = tab.getAttribute("data-tab");
    if (!targetId) return;

    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === targetId);
    
    });
  });
}

// Toggle
document.addEventListener("DOMContentLoaded", function () {
  const toggles = document.querySelectorAll("[data-toggle]");

  toggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      const group = toggle.dataset.group;

      if (group) {
        document.querySelectorAll(`[data-group="${group}"]`).forEach(el => {
          el.classList.remove("active");
        });
        toggle.classList.add("active");
      } else {
        toggle.classList.toggle("active");
      }
    });
  });
});

//accordion 
const accItems = document.querySelectorAll(".acc-item");

  accItems.forEach((item) => {
    const btn = item.querySelector(".acc-btn");
    const panel = item.querySelector(".acc-panel");

    btn.addEventListener("click", () => {
      const isActive = item.classList.contains("is-active");

      // 다른 항목 닫기
      accItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove("is-active");
          const otherPanel = other.querySelector(".acc-panel");
          otherPanel.style.height = 0;
        }
      });

      // 현재 항목 토글
      if (isActive) {
        // 닫기
        item.classList.remove("is-active");
        panel.style.height = 0;
      } else {
        // 열기
        item.classList.add("is-active");
        panel.style.height = panel.scrollHeight + "px"; // 실제 내용 높이 계산
      }
    });
  });


const drake = dragula(
  [document.getElementById("dragArea"), ],
  {
    mirrorContainer: document.body,
  }
);

drake.on("cloned", function (clone, original, type) {
  if (type === "mirror") {
    clone.innerHTML = "";

    clone.innerHTML = `
      <div class="ghost-drag-item">
        이동 중.
      </div>
    `;

    clone.classList.add("ghost-wrapper");
  }
});


// 테이블화 - 스크롤 대응 
const listheads = document.querySelectorAll('.listhead');
const listbodies = document.querySelectorAll('.listbody');

listheads.forEach((head, i) => {
  const body = listbodies[i];

  if (!body) return; 

  const headSpans = head.querySelectorAll('span');
  const widths = Array.from(headSpans).map(span =>
    span.style.width || window.getComputedStyle(span).width
  );

  const gridTemplate = widths.join(' ');

  const rows = body.querySelectorAll('.board li');

  rows.forEach(row => {
    row.style.display = "grid";
    row.style.gridTemplateColumns = gridTemplate;
  });
});

function initBrightnessControls() {
  document.querySelectorAll('.adx-br').forEach((control) => {
    const bar = control.querySelector('.adx-br__bar');
    const fill = control.querySelector('.adx-br__fill');
    const thumb = control.querySelector('.adx-br__thumb');
    const valueText = control.querySelector('.adx-br__val');

    if (!bar || !fill || !thumb || !valueText) return;

    let currentValue = Number(bar.getAttribute('aria-valuenow')) || 0;
    let isDragging = false;

    const clamp = (value) => {
      return Math.max(0, Math.min(100, value));
    };

    const render = (value) => {
      currentValue = clamp(value);
      const displayValue = Math.round(currentValue);

      fill.style.width = `${displayValue}%`;
      thumb.style.left = `calc(${displayValue}% - 9px)`;

      bar.setAttribute('aria-valuenow', displayValue);
      bar.setAttribute('aria-valuetext', `${displayValue}%`);

      valueText.innerHTML = `${displayValue}<span>%</span>`;
    };

    const updateFromPointer = (event) => {
      const rect = bar.getBoundingClientRect();
      if (!rect.width) return;

      const percent = ((event.clientX - rect.left) / rect.width) * 100;
      render(percent);
    };

    render(currentValue);

    bar.addEventListener('pointerdown', (event) => {
      isDragging = true;
      bar.setPointerCapture?.(event.pointerId);
      updateFromPointer(event);
    });

    bar.addEventListener('pointermove', (event) => {
      if (!isDragging) return;
      updateFromPointer(event);
    });

    bar.addEventListener('pointerup', (event) => {
      isDragging = false;
      bar.releasePointerCapture?.(event.pointerId);
    });

    bar.addEventListener('pointercancel', (event) => {
      isDragging = false;
      bar.releasePointerCapture?.(event.pointerId);
    });
  });
}

document.addEventListener('DOMContentLoaded', initBrightnessControls);