import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  recommendSnowboard,
  SnowboardRecommendationType,
  UserInputforSnowboardRecommendationSchema,
} from "@/lib/recommendation.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SnowboardRecommendationResult from "./snowboard-recommendation-result";

type SnowboardFormInputs = z.infer<
  typeof UserInputforSnowboardRecommendationSchema
>;

const formClassName =
  "mt-4 bg-background border border-border rounded-xl p-4 text-primary";

const formItemClassName = "text-lg";
const formInputClassName = "text-lg py-4 ";
const QuestionHeight = ({ control }: { control: any }) => (
  <FormField
    control={control}
    name="height"
    render={({ field }) => (
      <FormItem className={formItemClassName}>
        <FormLabel>Height (cm)</FormLabel>
        <FormControl>
          <Input
            type="number"
            {...field}
            onChange={(e) => field.onChange(parseInt(e.target.value))}
            className={formInputClassName}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const QuestionWeight = ({ control }: { control: any }) => (
  <FormField
    control={control}
    name="weight"
    render={({ field }) => (
      <FormItem className={formItemClassName}>
        <FormLabel>Weight (kg)</FormLabel>
        <FormControl>
          <Input
            type="number"
            {...field}
            onChange={(e) => field.onChange(parseInt(e.target.value))}
            className={formInputClassName}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const QuestionGender = ({ control }: { control: any }) => (
  <FormField
    control={control}
    name="gender"
    render={({ field }) => (
      <FormItem className={formItemClassName}>
        <FormLabel>Gender</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger className={formInputClassName}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

const QuestionSkillLevel = ({ control }: { control: any }) => (
  <FormField
    control={control}
    name="skillLevel"
    render={({ field }) => (
      <FormItem className={formItemClassName}>
        <FormLabel>Skill Level</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger className={formInputClassName}>
              <SelectValue placeholder="Select skill level" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

const QuestionRidingStyle = ({ control }: { control: any }) => (
  <FormField
    control={control}
    name="ridingStyle"
    render={({ field }) => (
      <FormItem className={formItemClassName}>
        <FormLabel>Riding Style</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger className={formInputClassName}>
              <SelectValue placeholder="Select riding style" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="freestyle">Freestyle</SelectItem>
            <SelectItem value="all-mountain">All-Mountain</SelectItem>
            <SelectItem value="powder">Powder</SelectItem>
            <SelectItem value="backcountry">Backcountry</SelectItem>
            <SelectItem value="splitboard">Splitboard</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

const GearRecommendationCard = () => {
  const [snowboardRecommendation, setSnowboardRecommendation] =
    useState<SnowboardRecommendationType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const form = useForm<SnowboardFormInputs>({
    resolver: zodResolver(UserInputforSnowboardRecommendationSchema),
    defaultValues: {
      height: 0,
      weight: 0,
      gender: "male",
      skillLevel: "beginner",
      ridingStyle: "all-mountain",
    },
  });

  const questions = [
    <QuestionHeight key="height" control={form.control} />,
    <QuestionWeight key="weight" control={form.control} />,
    <QuestionGender key="gender" control={form.control} />,
    <QuestionSkillLevel key="skillLevel" control={form.control} />,
    <QuestionRidingStyle key="ridingStyle" control={form.control} />,
  ];

  const onSubmit = (data: SnowboardFormInputs) => {
    const result = recommendSnowboard(data);
    if (result) {
      setSnowboardRecommendation(result);
    }
  };

  return (
    <div className="glass-dark px-2 py-4 rounded-xl max-w-md max-h-fit">
      <header className="px-4">
        <div className="text-sm mb-2 p-4 border rounded-full w-5 h-5 flex items-center justify-center mx-auto">
          0{currentQuestion + 1}
        </div>
        <h2 className="text-3xl">Gear Recommendation</h2>
        <p className="text-sm">Tell us about yourself</p>
      </header>

      {!snowboardRecommendation ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={formClassName}
          >
            <main className="my-2">{questions[currentQuestion]}</main>

            <footer className="flex justify-between">
              <Button
                type="button"
                variant={"outline"}
                size={"sm"}
                onClick={() =>
                  setCurrentQuestion((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              {currentQuestion === questions.length - 1 ? (
                <Button type="submit">Get Recommendation</Button>
              ) : (
                <Button
                  type="button"
                  variant={"outline"}
                  size={"sm"}
                  onClick={() =>
                    setCurrentQuestion((prev) =>
                      Math.min(questions.length - 1, prev + 1),
                    )
                  }
                >
                  Next
                </Button>
              )}
            </footer>
          </form>
        </Form>
      ) : (
        <SnowboardRecommendationResult
          snowboardRecommendation={snowboardRecommendation}
        />
      )}
    </div>
  );
};

export default GearRecommendationCard;
