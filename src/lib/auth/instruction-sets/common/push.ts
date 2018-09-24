import { binToHex } from '../../../utils';
import { Operator } from '../../virtual-machine';
import { BitcoinCashOpCodes } from '../bitcoin-cash/bitcoin-cash-opcodes';
import {
  applyError,
  bigIntToScriptNumber,
  CommonAuthenticationError,
  ErrorState,
  MinimumProgramState,
  StackMachineState
} from './common';

export const opPushNumber = <ProgramState extends StackMachineState>(
  value: number
): Operator<ProgramState> => ({
  asm: `OP_${value}`,
  description: `Push the Script Number ${value} onto the stack.`,
  operation: (state: ProgramState) => {
    // tslint:disable-next-line:no-expression-statement
    state.stack.push(bigIntToScriptNumber(BigInt(value)));
    return state;
  }
});

export const pushNumberOpCodes: ReadonlyArray<BitcoinCashOpCodes> = [
  BitcoinCashOpCodes.OP_1NEGATE,
  BitcoinCashOpCodes.OP_0,
  BitcoinCashOpCodes.OP_1,
  BitcoinCashOpCodes.OP_2,
  BitcoinCashOpCodes.OP_3,
  BitcoinCashOpCodes.OP_4,
  BitcoinCashOpCodes.OP_5,
  BitcoinCashOpCodes.OP_6,
  BitcoinCashOpCodes.OP_7,
  BitcoinCashOpCodes.OP_8,
  BitcoinCashOpCodes.OP_9,
  BitcoinCashOpCodes.OP_10,
  BitcoinCashOpCodes.OP_11,
  BitcoinCashOpCodes.OP_12,
  BitcoinCashOpCodes.OP_13,
  BitcoinCashOpCodes.OP_14,
  BitcoinCashOpCodes.OP_15,
  BitcoinCashOpCodes.OP_16
];

export const pushNumberOperators = <ProgramState extends StackMachineState>() =>
  pushNumberOpCodes
    .map((opcode, i) => ({ [opcode]: opPushNumber<ProgramState>(i - 1) }))
    .reduce((group, current) => ({ ...group, ...current }));

const pushToAsm = (array: Uint8Array, begin: number, end: number) => {
  const missingBytes = end - array.length;
  return missingBytes <= 0
    ? `0x${binToHex(array.slice(begin, end))}`
    : `0x${binToHex(
        array.slice(begin, array.length)
      )}[missing ${missingBytes} ${missingBytes > 1 ? 'bytes' : 'byte'}]`;
};

export const opPushDataConstant = <
  InstructionSetError,
  ProgramState extends StackMachineState &
    MinimumProgramState &
    ErrorState<InstructionSetError>
>(
  value: number
): Operator<ProgramState> => {
  const pushDataConstantMethod = <Result>(
    insufficientBits: (state: ProgramState) => Result,
    valid: (state: ProgramState, pushStart: number, pushEnd: number) => Result
  ) => (state: ProgramState) => {
    const pushStart = state.ip;
    const pushEnd = state.ip + value;
    // tslint:disable-next-line:no-if-statement
    if (state.script.length < pushEnd) {
      return insufficientBits(state);
    }
    return valid(state, pushStart, pushEnd);
  };

  return {
    asm: pushDataConstantMethod(
      state =>
        `OP_DATA_${value} ${pushToAsm(
          state.script,
          state.ip,
          state.ip + value
        )}`,
      (state, pushStart, pushEnd) =>
        `OP_DATA_${value} ${pushToAsm(state.script, pushStart, pushEnd)}`
    ),
    description: `Push the next ${
      value === 1 ? 'byte' : `${value} bytes`
    } onto the stack.`,
    operation: pushDataConstantMethod(
      state =>
        applyError<ProgramState, InstructionSetError>(
          CommonAuthenticationError.malformedPush,
          state
        ),
      (state, pushStart, pushEnd) => {
        // tslint:disable-next-line:no-expression-statement
        state.stack.push(state.script.slice(pushStart, pushEnd));
        // tslint:disable-next-line:no-object-mutation no-expression-statement
        state.ip = pushEnd;
        return state;
      }
    )
  };
};

export const pushDataConstantOpCodes: ReadonlyArray<BitcoinCashOpCodes> = [
  BitcoinCashOpCodes.OP_DATA_1,
  BitcoinCashOpCodes.OP_DATA_2,
  BitcoinCashOpCodes.OP_DATA_3,
  BitcoinCashOpCodes.OP_DATA_4,
  BitcoinCashOpCodes.OP_DATA_5,
  BitcoinCashOpCodes.OP_DATA_6,
  BitcoinCashOpCodes.OP_DATA_7,
  BitcoinCashOpCodes.OP_DATA_8,
  BitcoinCashOpCodes.OP_DATA_9,
  BitcoinCashOpCodes.OP_DATA_10,
  BitcoinCashOpCodes.OP_DATA_11,
  BitcoinCashOpCodes.OP_DATA_12,
  BitcoinCashOpCodes.OP_DATA_13,
  BitcoinCashOpCodes.OP_DATA_14,
  BitcoinCashOpCodes.OP_DATA_15,
  BitcoinCashOpCodes.OP_DATA_16,
  BitcoinCashOpCodes.OP_DATA_17,
  BitcoinCashOpCodes.OP_DATA_18,
  BitcoinCashOpCodes.OP_DATA_19,
  BitcoinCashOpCodes.OP_DATA_20,
  BitcoinCashOpCodes.OP_DATA_21,
  BitcoinCashOpCodes.OP_DATA_22,
  BitcoinCashOpCodes.OP_DATA_23,
  BitcoinCashOpCodes.OP_DATA_24,
  BitcoinCashOpCodes.OP_DATA_25,
  BitcoinCashOpCodes.OP_DATA_26,
  BitcoinCashOpCodes.OP_DATA_27,
  BitcoinCashOpCodes.OP_DATA_28,
  BitcoinCashOpCodes.OP_DATA_29,
  BitcoinCashOpCodes.OP_DATA_30,
  BitcoinCashOpCodes.OP_DATA_31,
  BitcoinCashOpCodes.OP_DATA_32,
  BitcoinCashOpCodes.OP_DATA_33,
  BitcoinCashOpCodes.OP_DATA_34,
  BitcoinCashOpCodes.OP_DATA_35,
  BitcoinCashOpCodes.OP_DATA_36,
  BitcoinCashOpCodes.OP_DATA_37,
  BitcoinCashOpCodes.OP_DATA_38,
  BitcoinCashOpCodes.OP_DATA_39,
  BitcoinCashOpCodes.OP_DATA_40,
  BitcoinCashOpCodes.OP_DATA_41,
  BitcoinCashOpCodes.OP_DATA_42,
  BitcoinCashOpCodes.OP_DATA_43,
  BitcoinCashOpCodes.OP_DATA_44,
  BitcoinCashOpCodes.OP_DATA_45,
  BitcoinCashOpCodes.OP_DATA_46,
  BitcoinCashOpCodes.OP_DATA_47,
  BitcoinCashOpCodes.OP_DATA_48,
  BitcoinCashOpCodes.OP_DATA_49,
  BitcoinCashOpCodes.OP_DATA_50,
  BitcoinCashOpCodes.OP_DATA_51,
  BitcoinCashOpCodes.OP_DATA_52,
  BitcoinCashOpCodes.OP_DATA_53,
  BitcoinCashOpCodes.OP_DATA_54,
  BitcoinCashOpCodes.OP_DATA_55,
  BitcoinCashOpCodes.OP_DATA_56,
  BitcoinCashOpCodes.OP_DATA_57,
  BitcoinCashOpCodes.OP_DATA_58,
  BitcoinCashOpCodes.OP_DATA_59,
  BitcoinCashOpCodes.OP_DATA_60,
  BitcoinCashOpCodes.OP_DATA_61,
  BitcoinCashOpCodes.OP_DATA_62,
  BitcoinCashOpCodes.OP_DATA_63,
  BitcoinCashOpCodes.OP_DATA_64,
  BitcoinCashOpCodes.OP_DATA_65,
  BitcoinCashOpCodes.OP_DATA_66,
  BitcoinCashOpCodes.OP_DATA_67,
  BitcoinCashOpCodes.OP_DATA_68,
  BitcoinCashOpCodes.OP_DATA_69,
  BitcoinCashOpCodes.OP_DATA_70,
  BitcoinCashOpCodes.OP_DATA_71,
  BitcoinCashOpCodes.OP_DATA_72,
  BitcoinCashOpCodes.OP_DATA_73,
  BitcoinCashOpCodes.OP_DATA_74,
  BitcoinCashOpCodes.OP_DATA_75
];

export const pushDataConstantOperators = <
  ProgramState extends StackMachineState &
    MinimumProgramState &
    ErrorState<InstructionSetError>,
  InstructionSetError
>() =>
  pushDataConstantOpCodes
    .map((opcode, i) => ({
      [opcode]: opPushDataConstant<InstructionSetError, ProgramState>(i + 1)
    }))
    .reduce((group, current) => ({ ...group, ...current }));

type Uint = 'Uint8' | 'Uint16' | 'Uint32';

const readLittleEndianLength = (
  script: Uint8Array,
  ip: number,
  lengthBits: number,
  type: Uint
) => {
  const view = new DataView(script.buffer, ip, lengthBits);
  const readAsLittleEndian = true;
  return type === 'Uint8'
    ? view.getUint8(0)
    : type === 'Uint16'
      ? view.getUint16(0, readAsLittleEndian)
      : view.getUint32(0, readAsLittleEndian);
};

export const createPushDataOperator = <
  InstructionSetError,
  ProgramState extends StackMachineState &
    MinimumProgramState &
    ErrorState<InstructionSetError>
>(
  lengthBits: number,
  type: Uint,
  minimum: number,
  maximum = 520
): Operator<ProgramState> => {
  const pushDataVariableMethod = <Result>(
    insufficientLengthBits: (state: ProgramState) => Result,
    insufficientTotalBits: (
      state: ProgramState,
      pushBegin: number,
      length: number
    ) => Result,
    belowMinimumLength: (
      state: ProgramState,
      pushBegin: number,
      length: number
    ) => Result,
    aboveMaximumLength: (
      state: ProgramState,
      pushBegin: number,
      length: number
    ) => Result,
    valid: (state: ProgramState, pushBegin: number, length: number) => Result
  ) => (state: ProgramState) => {
    const pushBegin = state.ip + lengthBits;
    // tslint:disable-next-line:no-if-statement
    if (state.script.length < pushBegin) {
      return insufficientLengthBits(state);
    }
    const length = readLittleEndianLength(
      state.script,
      state.ip,
      lengthBits,
      type
    );
    // tslint:disable-next-line:no-if-statement
    if (state.script.length < pushBegin + length) {
      return insufficientTotalBits(state, pushBegin, length);
    }
    // tslint:disable-next-line:no-if-statement
    if (length < minimum) {
      return belowMinimumLength(state, pushBegin, length);
    }
    // tslint:disable-next-line:no-if-statement
    if (length > maximum) {
      return aboveMaximumLength(state, pushBegin, length);
    }
    return valid(state, pushBegin, length);
  };

  const stringResult = (
    missing: (state: ProgramState) => string,
    print: (state: ProgramState, pushBegin: number, length: number) => string
  ) => pushDataVariableMethod(missing, print, print, print, print);

  return {
    asm: stringResult(
      _ =>
        `OP_PUSHDATA${lengthBits} [missing ${
          type === 'Uint8' ? 'byte' : `${lengthBits} bytes`
        }]`,
      (state: ProgramState, pushBegin: number, length: number) =>
        `OP_PUSHDATA${lengthBits} ${length} ${pushToAsm(
          state.script,
          pushBegin,
          pushBegin + length
        )}`
    ),
    description: stringResult(
      _ =>
        `Read the next ${
          type === 'Uint8' ? '' : 'little-endian '
        }${type} (missing) and push that number of bytes onto the stack.`,
      (state: ProgramState, pushBegin: number, length: number) =>
        `Read the next ${
          type === 'Uint8' ? '' : 'little-endian '
        }${type} (${pushToAsm(
          state.script,
          state.ip,
          pushBegin
        )}) and push that number of bytes (${length}) onto the stack.`
    ),
    operation: pushDataVariableMethod(
      state =>
        applyError<ProgramState, InstructionSetError>(
          CommonAuthenticationError.malformedPush,
          state
        ),
      state =>
        applyError<ProgramState, InstructionSetError>(
          CommonAuthenticationError.malformedPush,
          state
        ),
      state =>
        applyError<ProgramState, InstructionSetError>(
          CommonAuthenticationError.nonMinimalPush,
          state
        ),
      state =>
        applyError<ProgramState, InstructionSetError>(
          CommonAuthenticationError.exceedsMaximumPush,
          state
        ),
      (state, pushBegin, length) => {
        const pushEnd = pushBegin + length;
        // tslint:disable-next-line:no-expression-statement
        state.stack.push(state.script.slice(pushBegin, pushEnd));
        // tslint:disable-next-line:no-object-mutation no-expression-statement
        state.ip = pushEnd;
        return state;
      }
    )
  };
};

const enum PushOperationConstants {
  maximumPushDataConstant = 75,
  maximumPushSize = 520
}

export const opPushData1 = <
  InstructionSetError,
  ProgramState extends StackMachineState &
    MinimumProgramState &
    ErrorState<InstructionSetError>
>() =>
  createPushDataOperator<InstructionSetError, ProgramState>(
    Uint8Array.BYTES_PER_ELEMENT,
    'Uint8',
    PushOperationConstants.maximumPushDataConstant,
    PushOperationConstants.maximumPushSize
  );

const enum Byte {
  possibleStates = 256
}

const highestRepresentableNumberIn = (bytes: number) =>
  Byte.possibleStates ** bytes;

export const opPushData2 = <
  InstructionSetError,
  ProgramState extends StackMachineState &
    MinimumProgramState &
    ErrorState<InstructionSetError>
>() =>
  createPushDataOperator<InstructionSetError, ProgramState>(
    Uint16Array.BYTES_PER_ELEMENT,
    'Uint16',
    highestRepresentableNumberIn(Uint8Array.BYTES_PER_ELEMENT),
    PushOperationConstants.maximumPushSize
  );

/**
 * This implementation of `OP_PUSHDATA4` both requires minimal pushes and abides
 * by a 520-byte push limit, so it will always produce an error.
 */
export const opPushData4 = <
  InstructionSetError,
  ProgramState extends StackMachineState &
    MinimumProgramState &
    ErrorState<InstructionSetError>
>() =>
  createPushDataOperator<InstructionSetError, ProgramState>(
    Uint32Array.BYTES_PER_ELEMENT,
    'Uint32',
    highestRepresentableNumberIn(Uint16Array.BYTES_PER_ELEMENT),
    PushOperationConstants.maximumPushSize
  );

export const pushDataVariableOperators = <
  ProgramState extends StackMachineState &
    MinimumProgramState &
    ErrorState<InstructionSetError>,
  InstructionSetError
>() => ({
  [BitcoinCashOpCodes.OP_PUSHDATA1]: opPushData1<
    InstructionSetError,
    ProgramState
  >(),
  [BitcoinCashOpCodes.OP_PUSHDATA2]: opPushData2<
    InstructionSetError,
    ProgramState
  >(),
  [BitcoinCashOpCodes.OP_PUSHDATA4]: opPushData4<
    InstructionSetError,
    ProgramState
  >()
});
