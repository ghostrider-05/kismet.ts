const KISMET_CONNECTION_SPACE = 21
const KISMET_VARIABLE_OFFSET = 50
const KISMET_OUTPUT_OFFSET = 5

const KISMET_LINE_INDENT = '   '
const MAIN_SEQUENCE = "Sequence'Main_Sequence'"

const KISMET_NODE_TYPES = new Map<string, string>()
    .set('SequenceEvent', 'events')
    .set('SequenceAction', 'actions')
    .set('SequenceCondition', 'conditions')

const KISMET_PROPERTY_NAMES = {
    NAME: 'ObjName',
    CLASS: 'ObjCategory',
    INPUT: 'InputLinks',
    OUTPUT: 'OutputLinks',
    VARIABLE: 'VariableLinks'
}

const KISMET_NODE_LINES = {
    begin: (name: string, Class: string): string => `Begin Object Class=${Class} Name=${name}`,
    end: 'End Object'
}

export {
    KISMET_CONNECTION_SPACE,
    KISMET_LINE_INDENT,
    KISMET_NODE_LINES,
    KISMET_NODE_TYPES,
    KISMET_OUTPUT_OFFSET,
    KISMET_PROPERTY_NAMES,
    KISMET_VARIABLE_OFFSET,
    MAIN_SEQUENCE
}