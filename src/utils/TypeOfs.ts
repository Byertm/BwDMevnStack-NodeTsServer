const isCustomTypeOfControl = (controlType: unknown, customType: string) => {
	return typeof controlType === customType;
};

const isStringTypeOfControl = (controlType: unknown) => {
	return typeof controlType === 'string';
};

const isNumberTypeOfControl = (controlType: unknown) => {
	return typeof controlType === 'number';
};

export { isNumberTypeOfControl as isNumber, isStringTypeOfControl as isString, isCustomTypeOfControl as isCustom };

export default {
	isNumber: isNumberTypeOfControl,
	isString: isStringTypeOfControl,
	isCustom: isCustomTypeOfControl,
};