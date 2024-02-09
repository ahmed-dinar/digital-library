'use client'

import React, {FC} from "react";
import {Checkbox, Divider, GetProp} from "antd";
import {AuthorDto} from "@/types/author.types";
import {GenreDto} from "@/types/genre.types";
import {useRouter} from "next/navigation";

type PropType = {
  authors: AuthorDto[]
  genres: GenreDto[]
};

const {Group} = Checkbox;

const RightSideBar: FC<PropType> = ({authors, genres}) => {
  const router = useRouter();

  const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    if (checkedValues?.length > 0) {
      router.push(`/?genreId=${checkedValues.join(',')}`)
    } else {
      router.push(`/`)
    }
  };

  return (
    <div className="w-full bg-gray-100 rounded-2xl min-h-96 text-gray-700 border border-solid border-gray-100">
      <div className="flex flex-col p-4">
        <h3 className="text-lg font-bold text-gray-500">
          Filters
        </h3>

        {genres.length > 0 ? (
          <div>
            <Divider className="my-4"/>
            <h3 className="text-base font-bold text-gray-500 mb-2">
              Genre
            </h3>

            <div className="max-h-96 overflow-hidden hover:overflow-auto">
              <Group style={{width: '100%'}} onChange={onChange}>
                {genres.map(genre => (
                  <div key={genre.id} className="w-full mt-1">
                    <Checkbox value={genre.id}>{genre.name}</Checkbox>
                  </div>
                ))}
              </Group>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
};

export default RightSideBar;