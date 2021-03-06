import store from 'store'

const monthWrap = document.getElementById('month-wrap-id')

const clearSelectedClass = () => {
  for (let i = 0; i < monthWrap.children.length; i += 1) {
    monthWrap.children[i].classList.remove('selected')
  }
}

// Update store with new selected month
if (monthWrap) {
  monthWrap.onclick = (e) => {
    store.selectedMonthIndex = Number(e.target.value)
  }
}

// The store re-renders the view with this function
const updateSelectedTab = (state) => {
  clearSelectedClass()
  monthWrap.children[state.selectedMonthIndex].classList.add('selected')
}

export default updateSelectedTab
