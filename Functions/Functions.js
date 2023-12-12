export default Functions = {
    getShortMonthName: () => {
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
      
        const currentMonthIndex = new Date().getMonth();
        const shortMonthName = months[currentMonthIndex].slice(0, 3).toUpperCase();
      
        return shortMonthName;
    },
    formatDate: (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        // Padding single digit day/month with leading zero if needed
        const formattedDay = String(day).padStart(2, '0');
        const formattedMonth = String(month).padStart(2, '0');

        return `${formattedDay}/${formattedMonth}/${year}`;;
    },
    removeQuotes: (str) => {
        return str.replace(/^"(.*)"$/, '$1');
    },
    sortAscByDate: (List) => {
        let list = [List];
        list[0].sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
        return list;
    },
    sortDescByDate: (List) => {
        let list = [List]
        list[0].sort((a,b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        return list;
    }
}
