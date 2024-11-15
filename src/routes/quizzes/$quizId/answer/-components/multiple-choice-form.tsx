import { QuizQuestion } from "@/lib/quiz/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { MultipleChoiceInput, MultipleChoiceSchema } from "./schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { WebSocketHook } from "react-use-websocket/dist/lib/types";
import {
  QuizSubmitAnswerRequest,
  WebSocketEvent,
  WebSocketRequest,
} from "@/lib/websocket/types";

type Props = {
  socket: WebSocketHook;
  question: QuizQuestion;
  quizId: string;
};

export function MultipleChoiceForm(props: Props): JSX.Element {
  const form = useForm<MultipleChoiceInput>({
    resolver: zodResolver(MultipleChoiceSchema),
    defaultValues: {
      quiz_answer_id: "",
      user_id: "",
    },
  });

  async function onSubmit(value: MultipleChoiceInput): Promise<void> {
    const data: QuizSubmitAnswerRequest<MultipleChoiceInput> = {
      quiz_question_id: props.question.quiz_question_id,
      quiz_id: props.quizId,
      variant: props.question.variant,
      answer: value,
    };

    const message: WebSocketRequest<
      QuizSubmitAnswerRequest<MultipleChoiceInput>
    > = {
      event: WebSocketEvent.QuizSubmitAnswer,
      data: data,
    };

    console.log(message);

    props.socket.sendJsonMessage(message);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="quiz_answer_id"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  className="grid-cols-2"
                  onValueChange={field.onChange}
                >
                  {props.question.answers.map((answer) => (
                    <div
                      key={answer.quiz_answer_id}
                      className="relative flex flex-col gap-4 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring"
                    >
                      <div className="flex justify-between gap-2">
                        <RadioGroupItem
                          id={answer.quiz_answer_id}
                          value={answer.quiz_answer_id}
                          className="order-1 after:absolute after:inset-0"
                        />
                      </div>
                      <Label htmlFor={answer.quiz_answer_id}>
                        {answer.content}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}