import moment from 'moment';

export const isRestaurantOpen = (operationHours: any) => {
  console.log(operationHours);
  //Getting todays operation data
  const currentDay = moment(new Date()).format('dddd');

  const todaysOperationData = operationHours?.filter(
    (op: any) => op?.day === currentDay,
  );

  if (todaysOperationData.length === 0) {
    return {
      isOpen: false,
      message:
        'Sorry, this restaurant is closed today. Please check back tomorrow.',
    };
  }

  console.log('Operation today', todaysOperationData);

  //parsing time string from database to moment time
  const currentTime = moment();
  const parsedOpeningTime = moment(
    todaysOperationData[0].openingTime,
    'hh:mm A',
  );
  const parsedClosingTime = moment(
    todaysOperationData[0].closingTime,
    'hh:mm A',
  );

  //checking if current time is lies between opening and xlosing time, ie isOpen or not
  let isOpen;
  if (currentTime.isBetween(parsedOpeningTime, parsedClosingTime)) {
    isOpen = true;
  } else {
    isOpen = false;
  }

  const currentHour = new Date().getHours();

  return {
    isOpen,
    message: `This restaurant is currently closed and will reopen at ${todaysOperationData[0]?.openingTime} `,
  };
};
